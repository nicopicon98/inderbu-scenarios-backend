import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScenarioEntity } from 'src/infrastructure/persistence/scenario.entity';
import { NeighborhoodEntity } from 'src/infrastructure/persistence/neighborhood.entity';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { AbstractSeeder } from './abstract.seeder';
import { ISeeder } from '../interfaces/seeder.interface';
import { IScenarioSeed } from '../interfaces/scenario-seeds.interface';

@Injectable()
export class ScenarioSeeder extends AbstractSeeder<ScenarioEntity, IScenarioSeed> implements ISeeder {
  constructor(
    @Inject('SCENARIO_REPOSITORY')
    repository: Repository<ScenarioEntity>,
    @Inject('NEIGHBORHOOD_REPOSITORY')
    private neighborhoodRepository: Repository<NeighborhoodEntity>,
    @Inject('IDataLoader')
    protected jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<IScenarioSeed[]> {
    return this.jsonLoader.load<IScenarioSeed>('scenario-seeds.json');
  }

  protected async transform(seeds: IScenarioSeed[]): Promise<ScenarioEntity[]> {
    const entities: ScenarioEntity[] = [];
    for (const seed of seeds) {
      const neighborhood = await this.neighborhoodRepository.findOneBy({
        name: seed.neighborhoodName,
      });
      if (!neighborhood) {
        this.logger.warn(`Barrio ${seed.neighborhoodName} no encontrado.`);
        continue;
      }
      entities.push(this.repository.create({
        name: seed.name,
        address: seed.address,
        neighborhood,
      }));
    }
    return entities;
  }
}
