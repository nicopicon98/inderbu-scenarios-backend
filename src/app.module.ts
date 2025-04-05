import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { AuthModule } from './infrastructure/modules/auth.module';

import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CityEntity } from './infrastructure/persistence/city.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppCommandService } from './app.command';
import { SeedingService } from './core/application/services/seeding-service';
import { authEntitiesProviders } from './infrastructure/providers/auth.providers';
import { DatabaseModule } from './infrastructure/modules/database.module';
import { AppCommandModule } from './infrastructure/modules/command.module';

@Module({
  imports: [
    DatabaseModule, // Esto te da acceso al proveedor 'DATA_SOURCE'
    AuthModule,
    AppCommandModule,
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),
  ],
  providers: [
    SeedingService,
    ...authEntitiesProviders,
  ]
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedingService: SeedingService,
    private readonly appCommandService: AppCommandService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const isDevEnvironment = this.configService.get('NODE_ENV') === 'development';
    const shouldSeedDb = this.configService.get('SEED_DB') === 'true';
    
    if (isDevEnvironment || shouldSeedDb) {
      await this.seedingService.seed();
      // await this.appCommandService.create();
    }
  }
}
