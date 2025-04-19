import { DataSource } from 'typeorm';

import { FieldSurfaceTypeSeeder } from '../../core/application/services/seeding/seeders/field-surface-type.seeder';
import { SubScenarioPriceSeeder } from '../../core/application/services/seeding/seeders/sub-scenario-price.seeder';
import { JsonLoaderStrategy } from 'src/core/application/services/seeding/strategies/json-loader.strategy';
import { ActivityAreaSeeder } from '../../core/application/services/seeding/seeders/activity-area.seeder';
import { NeighborhoodSeeder } from 'src/core/application/services/seeding/seeders/neighborhood.seeder';
import { SubScenarioSeeder } from 'src/core/application/services/seeding/seeders/sub-scenario.seeder';
import { ScenarioSeeder } from 'src/core/application/services/seeding/seeders/scenario.seeder';
import { CommuneSeeder } from 'src/core/application/services/seeding/seeders/commune.seeder';
import { SeedingService } from 'src/core/application/services/seeding/seeding.service';
import { CitySeeder } from 'src/core/application/services/seeding/seeders/city.seeder';
import { RoleSeeder } from 'src/core/application/services/seeding/seeders/role.seeder';
import { UserSeeder } from 'src/core/application/services/seeding/seeders/user.seeder';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { CommuneEntity } from '../persistence/commune.entity';
import { RoleEntity } from '../persistence/role.entity';
import { CityEntity } from '../persistence/city.entity';
import { UserEntity } from '../persistence/user.entity';
import { DATA_SOURCE } from '../tokens/data_sources';

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
    provide: MYSQL_REPOSITORY.CITY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CityEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.ROLE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.COMMUNE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CommuneEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.NEIGHBORHOOD,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NeighborhoodEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.USER,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.FIELD_SURFACE_TYPE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('FieldSurfaceTypeEntity'),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.ACTIVITY_AREA,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('ActivityAreaEntity'),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.SCENARIO,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('ScenarioEntity'),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.SUB_SCENARIO,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('SubScenarioEntity'),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.SUB_SCENARIO_PRICE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository('SubScenarioPriceEntity'),
    inject: [DATA_SOURCE.MYSQL],
  },
];
