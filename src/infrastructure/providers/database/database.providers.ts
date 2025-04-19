import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { persistenceEntities } from './entities';

export const MYSQL_DATA_SOURCE = 'MYSQL_DATA_SOURCE';
export const databaseProviders = [
  {
    provide: MYSQL_DATA_SOURCE,
    useFactory: async (configService: ConfigService) => { // ConfigService inyectado
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('DB_HOST'), // Usa variables de entorno
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [...persistenceEntities],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      });
      return dataSource.initialize();
    },
    inject: [ConfigService], // ¡Esto es crucial!
  },
];