import { NeighborhoodEntity } from './neighborhood.entity';
import { PermissionEntity } from './permission.entity';
import { MenuItemEntity } from './menu-item.entity';
import { ModuleEntity } from './module.entity';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';
import { DataSource } from 'typeorm';

export const authEntitiesProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RoleEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MODULE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ModuleEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MENU_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MenuItemEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'NEIGHBORHOOD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(NeighborhoodEntity),
    inject: ['DATA_SOURCE'],
  },
];