import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';
import { ENV_CONFIG } from 'src/infrastructure/config/env.constants';
import { persistenceEntities } from './entities';

export const databaseProviders = [
  {
    provide: DATA_SOURCE.MYSQL,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get(ENV_CONFIG.DATABASE.HOST),
        port: configService.get<number>(ENV_CONFIG.DATABASE.PORT),
        username: configService.get(ENV_CONFIG.DATABASE.USER),
        password: configService.get(ENV_CONFIG.DATABASE.PASSWORD),
        database: configService.get(ENV_CONFIG.DATABASE.NAME),
        entities: [...persistenceEntities],
        synchronize: configService.get(ENV_CONFIG.DATABASE.SYNCHRONIZE) === 'true',
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];