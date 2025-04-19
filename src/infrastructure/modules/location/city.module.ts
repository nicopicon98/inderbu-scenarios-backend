import { Module } from '@nestjs/common';

import { CityController } from 'src/infrastructure/adapters/inbound/http/controllers/city.controller';
import { cityProviders } from 'src/infrastructure/providers/city/city.providers';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [CityController],
  providers: [...cityProviders],
  exports: [],
})
export class CityModule {}
