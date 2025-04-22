import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SeedingService } from '../../../core/application/services/seeding/seeding.service';
import { ENV_CONFIG } from 'src/infrastructure/config/env.constants';
import { LocationModule } from '../location/location.module';
import { DatabaseModule } from '../database/database.module';
import { ActivityAreaModule } from '../activity-area.module';
import { SubScenarioModule } from '../sub-scenario.module';
import { AppCommandModule } from './command.module';
import { SeedingModule } from './seeding.module';
import { AuthModule } from '../auth.module';
import { UserModule } from '../user.module';
import { ReservationModule } from '../reservation.module';
import { EmailModule } from '../email.module';

@Module({
  imports: [
    DatabaseModule, // Esto da acceso al proveedor 'DATA_SOURCE.MYSQL'
    AuthModule,
    UserModule,
    LocationModule,
    SubScenarioModule,
    ActivityAreaModule,
    ReservationModule,
    EmailModule,
    AppCommandModule,
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),
    SeedingModule
  ],
  providers: []
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedingService: SeedingService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const isDevEnvironment = this.configService.get(ENV_CONFIG.APP.NODE_ENV) === 'development';
    const shouldSeedDb = this.configService.get(ENV_CONFIG.APP.SEED_DB) === 'true';
    
    if (isDevEnvironment || shouldSeedDb) {
      await this.seedingService.seed();
    }
  }
}
