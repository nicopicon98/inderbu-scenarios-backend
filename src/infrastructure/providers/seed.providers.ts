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
import { FieldSurfaceTypeSeeder } from '../../core/application/services/seeding/seeders/field-surface-type.seeder';
import { ActivityAreaSeeder } from '../../core/application/services/seeding/seeders/activity-area.seeder';
import { ScenarioSeeder } from 'src/core/application/services/seeding/seeders/scenario.seeder';
import { SubScenarioSeeder } from 'src/core/application/services/seeding/seeders/sub-scenario.seeder';
import { SubScenarioPriceSeeder } from '../../core/application/services/seeding/seeders/sub-scenario-price.seeder';
import { MYSQL_DATA_SOURCE } from './database/database.providers';

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
  FieldSurfaceTypeSeeder,
  ActivityAreaSeeder,
  ScenarioSeeder,
  SubScenarioSeeder,
  SubScenarioPriceSeeder,
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
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'COMMUNE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CommuneEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'NEIGHBORHOOD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NeighborhoodEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'FIELD_SURFACE_TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('FieldSurfaceTypeEntity'),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'ACTIVITY_AREA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('ActivityAreaEntity'),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'SCENARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('ScenarioEntity'),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'SUB_SCENARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('SubScenarioEntity'),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'SUB_SCENARIO_PRICE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('SubScenarioPriceEntity'),
    inject: [MYSQL_DATA_SOURCE],
  },
];
