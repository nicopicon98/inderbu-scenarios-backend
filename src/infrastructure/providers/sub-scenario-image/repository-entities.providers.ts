import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { SubScenarioImageEntity } from 'src/infrastructure/persistence/image.entity';
import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';

export const repositoryEntitiesProviders: Provider[] = [
  {
    provide: SubScenarioImageEntity,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SubScenarioImageEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
];
