import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserRepositoryAdapter } from '../adapters/outbound/repositories/user-repository.adapter';
import { AuthController } from '../adapters/inbound/http/controllers/auth.controller';
import { AuthenticationService } from 'src/core/application/services/auth.service';
import { JwtStrategy } from '../adapters/inbound/http/strategies/jwt.strategy';
import { authEntitiesProviders } from '../providers/auth.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '60s' },
    }),
    DatabaseModule
  ],
  providers: [...authEntitiesProviders],
  exports: [AuthenticationService],
  controllers: [AuthController],
})
export class AuthModule {}
