import { DataSource } from 'typeorm';


import { UserRepositoryAdapter } from '../adapters/outbound/repositories/user-repository.adapter';
import { UserApplicationService } from 'src/core/application/services/user-application.service';
import { MYSQL_REPOSITORY } from '../tokens/repositories';
import { UserEntity } from '../persistence/user.entity';
import { DATA_SOURCE } from '../tokens/data_sources';

export const userProviders = [
  {
    provide: 'IUserApplicationPort',
    useClass: UserApplicationService,
  },
  {
    provide: 'IUserRepositoryPort',
    useClass: UserRepositoryAdapter,
  },
  {
    provide: MYSQL_REPOSITORY.USER,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
];
