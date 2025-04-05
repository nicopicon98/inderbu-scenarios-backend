import { NeighborhoodEntity } from '../persistence/neighborhood.entity';
import { PermissionEntity } from '../persistence/permission.entity';
import { ModuleEntity } from '../persistence/module.entity';
import { UserEntity } from '../persistence/user.entity';
import { DataSource } from 'typeorm';
import { CityEntity } from '../persistence/city.entity';
import { MenuItemEntity } from '../persistence/menu-item.entity';
import { CommuneEntity } from '../persistence/commune.entity';
import { RoleEntity } from '../persistence/role.entity';


export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'test',
        entities: [
            // __dirname + '/../**/*.entity{.ts,.js}', // TODO: investigar por qué esto nos generaba error
          UserEntity,
          RoleEntity,
          PermissionEntity,
          ModuleEntity,
          MenuItemEntity,
          NeighborhoodEntity,
          CommuneEntity,
          CityEntity
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
