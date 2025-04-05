import { Module } from '@nestjs/common';

import { CityController } from '../adapters/inbound/http/controllers/city.controller';
import { DatabaseModule } from './database.module';
import { CityProviders } from '../providers/city.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CityController],
  providers: [...CityProviders],
  exports: [],
})
export class CityModule {}
