import { Module } from '@nestjs/common';
import { CityModule } from './city.module';
import { NeighborhoodModule } from './neighborhood.module';

@Module({
  imports: [
    CityModule,
    NeighborhoodModule
  ],
  providers: [],
})
export class LocationModule {}
