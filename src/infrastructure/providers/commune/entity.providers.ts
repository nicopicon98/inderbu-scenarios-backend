import { DataSource } from 'typeorm';

import { CommuneEntity } from 'src/infrastructure/persistence/commune.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';

export const repositoryEntityProviders = [
  {
    provide: MYSQL_REPOSITORY.COMMUNE,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(CommuneEntity);
    },
    inject: [DATA_SOURCE.MYSQL],
  },
];
