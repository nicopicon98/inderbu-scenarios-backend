import { NeighborhoodEntity } from './neighborhood.entity';
import { PermissionEntity } from './permission.entity';
import { MenuItemEntity } from './menu-item.entity';
import { ModuleEntity } from './module.entity';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';
import { DataSource } from 'typeorm';
import { CommuneEntity } from './commune.entity';
import { CityEntity } from './city.entity';


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
