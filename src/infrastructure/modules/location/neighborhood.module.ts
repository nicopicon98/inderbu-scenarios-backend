import { Module } from '@nestjs/common';

import { NeighborhoodController } from 'src/infrastructure/adapters/inbound/http/controllers/neighborhood.controller';
import { neighborhoodProviders } from 'src/infrastructure/providers/neighborhood/neighborhood.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  providers: [...neighborhoodProviders],
  controllers: [NeighborhoodController],
})
export class NeighborhoodModule {}
