import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { CityController } from 'src/infrastructure/adapters/inbound/http/controllers/city.controller';
import { CityProviders } from 'src/infrastructure/providers/city.providers';


@Module({
  imports: [DatabaseModule],
  controllers: [CityController],
  providers: [...CityProviders],
  exports: [],
})
export class CityModule {}
