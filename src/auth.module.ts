import { Module } from '@nestjs/common';
import { authEntitiesProviders } from './auth.providers';
import { DatabaseModule } from './database.module';
import { UserModule } from './infrastructure/modules/user.module';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';

@Module({
  imports: [
    DatabaseModule,
    UserModule
    
  ],
  providers: [
    ...authEntitiesProviders,
  ],
})
export class AuthModule {}