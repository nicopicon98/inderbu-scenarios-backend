import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { SubScenarioPriceEntity } from 'src/infrastructure/persistence/sub-scenario-price.entity';
import { ISubScenarioPriceSeed } from '../interfaces/sub-scenario-price-seed.interface';
import { SubScenarioEntity } from 'src/infrastructure/persistence/sub-scenario.entity';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { ISeeder } from '../interfaces/seeder.interface';
import { AbstractSeeder } from './abstract.seeder';

@Injectable()
export class SubScenarioPriceSeeder extends AbstractSeeder<SubScenarioPriceEntity, ISubScenarioPriceSeed> implements ISeeder {
  constructor(
    @Inject('SUB_SCENARIO_PRICE_REPOSITORY')
    repository: Repository<SubScenarioPriceEntity>,
    @Inject('SUB_SCENARIO_REPOSITORY')
    private subScenarioRepository: Repository<SubScenarioEntity>,
    @Inject('IDataLoader')
    protected jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<ISubScenarioPriceSeed[]> {
    return this.jsonLoader.load<ISubScenarioPriceSeed>('sub-scenario-price-seeds.json');
  }

  protected async transform(seeds: ISubScenarioPriceSeed[]): Promise<SubScenarioPriceEntity[]> {
    const entities: SubScenarioPriceEntity[] = [];
    for (const seed of seeds) {
      const subScenario = await this.subScenarioRepository.findOneBy({ name: seed.subScenarioName });
      if (!subScenario) {
        this.logger.warn(`Subescenario ${seed.subScenarioName} no encontrado.`);
        continue;
      }
      const subScenarioPrice = this.repository.create({
        subScenario,
        price: seed.price,
      });
      entities.push(subScenarioPrice);
    }
    return entities;
  }
}
