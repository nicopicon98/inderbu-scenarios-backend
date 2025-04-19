import { DataSource } from 'typeorm';

import { UserRepositoryAdapter } from '../adapters/outbound/repositories/user-repository.adapter';
import { UserApplicationService } from 'src/core/application/services/user-application.service';
import { AuthenticationService } from 'src/core/application/services/auth.service';
import { JwtStrategy } from '../adapters/inbound/http/strategies/jwt.strategy';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { PermissionEntity } from '../persistence/permission.entity';
import { MYSQL_DATA_SOURCE } from './database/database.providers';
import { MenuItemEntity } from '../persistence/menu-item.entity';
import { ModuleEntity } from '../persistence/module.entity';
import { UserEntity } from '../persistence/user.entity';
import { RoleEntity } from '../persistence/role.entity';

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
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PermissionEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'MODULE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ModuleEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'MENU_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MenuItemEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
  {
    provide: 'NEIGHBORHOOD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NeighborhoodEntity),
    inject: [MYSQL_DATA_SOURCE],
  },
];
