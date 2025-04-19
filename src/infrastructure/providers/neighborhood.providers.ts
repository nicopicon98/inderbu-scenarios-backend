import { DataSource } from 'typeorm';

import { NeighborhoodApplicationService } from 'src/core/application/services/neighborhood-application.service';
import { NeighborhoodRepositoryAdapter } from '../adapters/outbound/repositories/neighborhood-repository.adapter';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { DATA_SOURCE } from '../tokens/data_sources';

export const neighborhoodProviders = [
  {
    provide: MYSQL_REPOSITORY.NEIGHBORHOOD,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(NeighborhoodEntity);
    },
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: 'INeighborhoodRepositoryPort',
    useClass: NeighborhoodRepositoryAdapter,
  },
  {
    provide: 'INeighborhoodApplicationPort',
    useClass: NeighborhoodApplicationService,
  },
];
