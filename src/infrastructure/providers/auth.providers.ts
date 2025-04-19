import { DataSource } from 'typeorm';

import { UserRepositoryAdapter } from '../adapters/outbound/repositories/user-repository.adapter';
import { UserApplicationService } from 'src/core/application/services/user-application.service';
import { AuthenticationService } from 'src/core/application/services/auth.service';
import { JwtStrategy } from '../adapters/inbound/http/strategies/jwt.strategy';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { PermissionEntity } from '../persistence/permission.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { MenuItemEntity } from '../persistence/menu-item.entity';
import { ModuleEntity } from '../persistence/module.entity';
import { UserEntity } from '../persistence/user.entity';
import { RoleEntity } from '../persistence/role.entity';
import { DATA_SOURCE } from '../tokens/data_sources';

export const authEntitiesProviders = [
  AuthenticationService,
  {
    provide: 'IUserRepositoryPort',
    useClass: UserRepositoryAdapter,
  },
  {
    provide: 'IUserApplicationPort',
    useClass: UserApplicationService,
  },
  JwtStrategy,
  {
    provide: MYSQL_REPOSITORY.USER,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.ROLE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.PERMISSION,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PermissionEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.MODULE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ModuleEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.MENU_ITEM,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MenuItemEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.NEIGHBORHOOD,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NeighborhoodEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
];
