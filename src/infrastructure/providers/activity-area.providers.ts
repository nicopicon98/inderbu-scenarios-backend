import { DataSource } from 'typeorm';

import { ActivityAreaApplicationService } from 'src/core/application/services/activity-area-application.service';
import { ActivityAreaRepositoryAdapter } from '../adapters/outbound/repositories/activity-area-repository.adapter';
import { ActivityAreaEntity } from '../persistence/activity-area.entity';
import { MYSQL_DATA_SOURCE } from './database/database.providers';

export const activityAreaProviders = [
  {
    provide: 'ACTIVITY_AREA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActivityAreaEntity),
    inject: [MYSQL_DATA_SOURCE],
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
