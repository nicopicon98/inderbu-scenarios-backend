import { Module } from '@nestjs/common';
import { CityModule } from './city.module';

@Module({
  imports: [
    CityModule,
    //NeighborhoodModule
  ],
  providers: [],
})
export class LocationModule {}
