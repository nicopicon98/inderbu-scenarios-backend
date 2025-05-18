import { Module } from '@nestjs/common';

import { ScenarioController } from 'src/infrastructure/adapters/inbound/http/controllers/scenario.controller';
import { scenarioProviders } from '../providers/scenario/scenario.providers';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [ScenarioController],
  providers: [
    ...scenarioProviders
  ],
  exports: [APPLICATION_PORTS.SCENARIO, REPOSITORY_PORTS.SCENARIO],
})
export class ScenarioModule {}
