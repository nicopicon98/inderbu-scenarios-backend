// src/infrastructure/seeding/seeding.module.ts
import { Module } from '@nestjs/common';
import { CitySeeder } from 'src/core/application/services/seeding/seeders/city.seeder';
import { CommuneSeeder } from 'src/core/application/services/seeding/seeders/commune.seeder';
import { NeighborhoodSeeder } from 'src/core/application/services/seeding/seeders/neighborhood.seeder';
import { SeedingService } from 'src/core/application/services/seeding/seeding.service';
import { JsonLoaderStrategy } from 'src/core/application/services/seeding/strategies/json-loader.strategy';
import { seedProviders } from 'src/infrastructure/providers/seed.providers';
import { DatabaseModule } from '../database.module';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    DiscoveryModule
  ],
  providers: [...seedProviders],
  exports: [...seedProviders],
})
export class SeedingModule {}
