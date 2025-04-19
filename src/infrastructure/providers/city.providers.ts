import { DataSource } from 'typeorm';

import { CityRepositoryAdapter } from '../adapters/outbound/repositories/city-repository.adapter';
import { CityApplicationService } from 'src/core/application/services/city-application.service';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { CityEntity } from '../persistence/city.entity';
import { DATA_SOURCE } from '../tokens/data_sources';

export const CityProviders = [
  {
    provide: 'ICityApplicationPort',
    useClass: CityApplicationService,
  },
  {
    provide: 'ICityRepositoryPort',
    useClass: CityRepositoryAdapter
  },
  {
    provide: MYSQL_REPOSITORY.CITY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CityEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
];
