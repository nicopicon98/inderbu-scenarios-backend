import { NeighborhoodApplicationService } from 'src/core/application/services/neighborhood-application.service';
import { NeighborhoodRepositoryAdapter } from '../adapters/outbound/repositories/neighborhood-repository.adapter';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { DataSource } from 'typeorm';
import { MYSQL_DATA_SOURCE } from './database/database.providers';

export const neighborhoodProviders = [
  {
    provide: 'NEIGHBORHOOD_REPOSITORY',
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(NeighborhoodEntity);
    },
    inject: [MYSQL_DATA_SOURCE],
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
