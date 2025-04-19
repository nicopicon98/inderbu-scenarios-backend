import { CityApplicationService } from 'src/core/application/services/city-application.service';
import { CityRepositoryAdapter } from '../adapters/outbound/repositories/city-repository.adapter';
import { DataSource } from 'typeorm';
import { CityEntity } from '../persistence/city.entity';
import { MYSQL_DATA_SOURCE } from './database/database.providers';

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
    provide: 'CITY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CityEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
];
