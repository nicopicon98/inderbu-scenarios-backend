import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

import { JsonLoaderStrategy } from 'src/core/application/services/seeding/strategies/json-loader.strategy';
import { NeighborhoodSeeder } from 'src/core/application/services/seeding/seeders/neighborhood.seeder';
import { CommuneSeeder } from 'src/core/application/services/seeding/seeders/commune.seeder';
import { SeedingService } from 'src/core/application/services/seeding/seeding.service';
import { CitySeeder } from 'src/core/application/services/seeding/seeders/city.seeder';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { CommuneEntity } from '../persistence/commune.entity';
import { RoleEntity } from '../persistence/role.entity';
import { CityEntity } from '../persistence/city.entity';
import { UserEntity } from '../persistence/user.entity';
import { RoleSeeder } from 'src/core/application/services/seeding/seeders/role.seeder';
import { UserSeeder } from 'src/core/application/services/seeding/seeders/user.seeder';

/**
 * Important: Import seeders in the order of dependencies. Cardinality is important.
 * For example, if a NeighborhoodSeeder depends on a CommuneSeeder, the CommuneSeeder
 * must be imported before the NeighborhoodSeeder.
 */
export const seedProviders = [
  SeedingService,
  CitySeeder,
  CommuneSeeder,
  NeighborhoodSeeder,
  RoleSeeder,
  UserSeeder,
  {
    provide: 'IDataLoader',
    useClass: JsonLoaderStrategy,
  },
  {
    provide: 'JSON_LOADER_STRATEGY',
    useFactory: () => new JsonLoaderStrategy(),
  },
  {
    provide: 'DATA_LOADER',
    useFactory: (jsonLoaderStrategy) => jsonLoaderStrategy,
    inject: ['JSON_LOADER_STRATEGY'],
  },
  {
    provide: 'CITY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CityEntity),
    inject: ['MYSQL_DATA_SOURCE'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: ['MYSQL_DATA_SOURCE'],
  },
  {
    provide: 'COMMUNE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CommuneEntity),
    inject: ['MYSQL_DATA_SOURCE'],
  },
  {
    provide: 'NEIGHBORHOOD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NeighborhoodEntity),
    inject: ['MYSQL_DATA_SOURCE'],
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['MYSQL_DATA_SOURCE'],
  }
];
