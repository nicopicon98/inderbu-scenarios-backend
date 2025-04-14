import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { AppCommandService } from 'src/core/application/services/app-command.service';
import { SeedingService } from '../../../core/application/services/seeding/seeding.service';
import { authEntitiesProviders } from '../../providers/auth.providers';
import { LocationModule } from '../location/location.module';
import { DatabaseModule } from '../database.module';
import { AppCommandModule } from './command.module';
import { AuthModule } from '../auth.module';
import { UserModule } from '../user.module';
import { SeedingModule } from './seeding.module';
import { seedProviders } from 'src/infrastructure/providers/seed.providers';

@Module({
  imports: [
    DatabaseModule, // Esto da acceso al proveedor 'MYSQL_DATA_SOURCE'
    AuthModule,
    UserModule,
    LocationModule,
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
    const isDevEnvironment = this.configService.get('NODE_ENV') === 'development';
    const shouldSeedDb = this.configService.get('SEED_DB') === 'true';
    
    if (isDevEnvironment || shouldSeedDb) {
      await this.seedingService.seed();
    }
  }
}
