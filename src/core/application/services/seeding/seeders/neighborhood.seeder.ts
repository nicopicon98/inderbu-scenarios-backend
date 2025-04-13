import { NeighborhoodEntity } from 'src/infrastructure/persistence/neighborhood.entity';
import { CommuneEntity } from 'src/infrastructure/persistence/commune.entity';
import { INeighborhoodSeed } from '../interfaces/neighborhood-seed.interface';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { AbstractSeeder } from './abstract.seeder';

import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ISeeder } from '../interfaces/seeder.interface';
@Injectable()
export class NeighborhoodSeeder
  extends AbstractSeeder<NeighborhoodEntity, INeighborhoodSeed>
  implements ISeeder
{
  constructor(
    @Inject('NEIGHBORHOOD_REPOSITORY')
    repository: Repository<NeighborhoodEntity>,
    @Inject('COMMUNE_REPOSITORY')
    private communeRepository: Repository<CommuneEntity>,
    @Inject('IDataLoader')
    protected jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<INeighborhoodSeed[]> {
    return this.jsonLoader.load<INeighborhoodSeed>('neighborhood-seeds.json');
  }

  protected async transform(
    seeds: INeighborhoodSeed[],
  ): Promise<NeighborhoodEntity[]> {
    const entities: NeighborhoodEntity[] = [];
    for (const seed of seeds) {
      const commune = await this.communeRepository.findOneBy({
        name: seed.communeName,
      });
      if (!commune) {
        this.logger.warn(`Comuna ${seed.communeName} no encontrada.`);
        continue;
      }
      entities.push(this.repository.create({ name: seed.name, commune }));
    }
    return entities;
  }
}
