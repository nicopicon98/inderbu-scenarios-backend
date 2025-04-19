import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';
import { persistenceEntities } from './entities';

export const databaseProviders = [
  {
    provide: DATA_SOURCE.MYSQL,
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
    inject: [ConfigService],
  },
];