import { DataSource } from 'typeorm';

import { ActivityAreaApplicationService } from 'src/core/application/services/activity-area-application.service';
import { ActivityAreaRepositoryAdapter } from '../adapters/outbound/repositories/activity-area-repository.adapter';
import { ActivityAreaEntity } from '../persistence/activity-area.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { DATA_SOURCE } from '../tokens/data_sources';

export const activityAreaProviders = [
  {
    provide: MYSQL_REPOSITORY.ACTIVITY_AREA,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActivityAreaEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: 'IActivityAreaRepositoryPort',
    useClass: ActivityAreaRepositoryAdapter,
  },
  {
    provide: 'IActivityAreaApplicationPort',
    useClass: ActivityAreaApplicationService,
  },
];
