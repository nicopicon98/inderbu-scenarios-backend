import { Module } from '@nestjs/common';

import { UserController } from '../adapters/inbound/http/controllers/user/user.controller';
import { DatabaseModule } from './database/database.module';
import { userProviders } from '../providers/user/user.providers';
import { UserReservationsController } from '../adapters/inbound/http/controllers/user/user-reservations.controller';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [UserController, UserReservationsController],
  providers: [...userProviders],
})
export class UserModule {}
