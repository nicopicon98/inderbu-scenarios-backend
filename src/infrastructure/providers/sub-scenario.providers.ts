import { DataSource } from 'typeorm';

import { ActivityAreaRepositoryAdapter } from '../adapters/outbound/repositories/activity-area-repository.adapter';
import { NeighborhoodRepositoryAdapter } from '../adapters/outbound/repositories/neighborhood-repository.adapter';
import { SubScenarioRepositoryAdapter } from '../adapters/outbound/repositories/sub-scenario-repository.adapter';
import { SubScenarioApplicationService } from 'src/core/application/services/sub-scenario-application.service';
import { ScenarioRepositoryAdapter } from '../adapters/outbound/repositories/scenario-repository.adapter';
import { ActivityAreaEntity } from '../persistence/activity-area.entity';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { SubScenarioEntity } from '../persistence/sub-scenario.entity';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { ScenarioEntity } from '../persistence/scenario.entity';
import { REPOSITORY_PORTS } from '../tokens/ports';
import { DATA_SOURCE } from '../tokens/data_sources';

export const subScenarioProviders = [
  {
    provide: APPLICATION_PORTS.SUB_SCENARIO,
    useClass: SubScenarioApplicationService,
  },
  {
    provide: REPOSITORY_PORTS.SUB_SCENARIO,
    useClass: SubScenarioRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.NEIGHBORHOOD,
    useClass: NeighborhoodRepositoryAdapter,
  },
  {
    provide: MYSQL_REPOSITORY.SUB_SCENARIO,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SubScenarioEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.SCENARIO,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ScenarioEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.ACTIVITY_AREA,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActivityAreaEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.NEIGHBORHOOD,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NeighborhoodEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: REPOSITORY_PORTS.SCENARIO,
    useClass: ScenarioRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.ACTIVITY_AREA,
    useClass: ActivityAreaRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.FIELD_SURFACE,
    useClass: ActivityAreaRepositoryAdapter,
  },
];
