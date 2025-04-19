import { Module } from '@nestjs/common';

import { SubScenarioController } from '../adapters/inbound/http/controllers/sub-scenario.controller';
import { subScenarioProviders } from '../providers/sub-scenario/sub-scenario.providers';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [SubScenarioController],
  providers: [...subScenarioProviders],
  exports: [],
})
export class SubScenarioModule {}
