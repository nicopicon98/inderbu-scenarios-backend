import { CommuneEntity } from 'src/infrastructure/persistence/commune.entity';
import { CityEntity } from 'src/infrastructure/persistence/city.entity';
import { ICommuneSeed } from '../interfaces/commune-seed.interface';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { AbstractSeeder } from './abstract.seeder';

import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ISeeder } from '../interfaces/seeder.interface';

@Injectable()
export class CommuneSeeder
  extends AbstractSeeder<CommuneEntity, ICommuneSeed>
  implements ISeeder
{
  constructor(
    @Inject('COMMUNE_REPOSITORY')
    repository: Repository<CommuneEntity>,
    @Inject('CITY_REPOSITORY')
    private cityRepository: Repository<CityEntity>,
    @Inject('IDataLoader')
    protected jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<ICommuneSeed[]> {
    return this.jsonLoader.load<ICommuneSeed>('commune-seeds.json');
  }

  protected async transform(seeds: ICommuneSeed[]): Promise<CommuneEntity[]> {
    const entities: CommuneEntity[] = [];
    for (const seed of seeds) {
      const city = await this.cityRepository.findOneBy({ name: seed.cityName });
      if (!city) {
        this.logger.warn(`Ciudad ${seed.cityName} no encontrada.`);
        continue;
      }
      entities.push(this.repository.create({ name: seed.name, city }));
    }
    return entities;
  }
}
