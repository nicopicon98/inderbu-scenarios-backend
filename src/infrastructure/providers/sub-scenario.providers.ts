import { DataSource } from 'typeorm';

import { ActivityAreaRepositoryAdapter } from '../adapters/outbound/repositories/activity-area-repository.adapter';
import { SubScenarioRepositoryAdapter } from '../adapters/outbound/repositories/sub-scenario-repository.adapter';
import { SubScenarioApplicationService } from 'src/core/application/services/sub-scenario-application.service';
import { ScenarioRepositoryAdapter } from '../adapters/outbound/repositories/scenario-repository.adapter';
import { ActivityAreaEntity } from '../persistence/activity-area.entity';
import { SubScenarioEntity } from '../persistence/sub-scenario.entity';
import { ScenarioEntity } from '../persistence/scenario.entity';
import { PORTS } from 'src/core/application/tokens/ports';
import { MYSQL_DATA_SOURCE } from './database/database.providers';

export const subScenarioProviders = [
  {
    provide: 'ISubScenarioApplicationPort',
    useClass: SubScenarioApplicationService, // Cambia esto por la implementación real
  },
  {
    provide: PORTS.SubScenarioRepo,
    useClass: SubScenarioRepositoryAdapter, // Cambia esto por la implementación real
  },
  {
    provide: 'SUB_SCENARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SubScenarioEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'SCENARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ScenarioEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'ACTIVITY_AREA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActivityAreaEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: PORTS.ScenarioRepo,
    useClass: ScenarioRepositoryAdapter,
  },
  {
    provide: PORTS.ActivityAreaRepo,
    useClass: ActivityAreaRepositoryAdapter,
  },
  {
    provide: PORTS.FieldSurfaceRepo,
    useClass: ActivityAreaRepositoryAdapter,
  },
];
