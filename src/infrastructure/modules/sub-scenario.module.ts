import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { SubScenarioImageController } from '../adapters/inbound/http/controllers/sub-scenario-image.controller';
import { subScenarioImageProviders } from '../providers/sub-scenario-image/sub-scenario-image.providers';
import { SubScenarioController } from '../adapters/inbound/http/controllers/sub-scenario.controller';
import { FileStorageService } from '../adapters/outbound/file-storage/file-storage.service';
import { subScenarioProviders } from '../providers/sub-scenario/sub-scenario.providers';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [SubScenarioController, SubScenarioImageController],
  providers: [...subScenarioProviders, ...subScenarioImageProviders, FileStorageService],
  exports: [],
})
export class SubScenarioModule {}
