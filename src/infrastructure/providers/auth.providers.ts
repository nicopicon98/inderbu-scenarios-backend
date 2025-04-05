import { DataSource } from 'typeorm';
import { UserEntity } from '../persistence/user.entity';
import { RoleEntity } from '../persistence/role.entity';
import { PermissionEntity } from '../persistence/permission.entity';
import { ModuleEntity } from '../persistence/module.entity';
import { MenuItemEntity } from '../persistence/menu-item.entity';
import { NeighborhoodEntity } from '../persistence/neighborhood.entity';

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