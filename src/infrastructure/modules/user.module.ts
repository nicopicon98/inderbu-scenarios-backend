import { Module } from '@nestjs/common';
import { UserController } from '../adapters/inbound/http/controllers/user.controller';
import { UserApplicationService } from 'src/core/application/services/user-application.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserApplicationPort',
      useClass: UserApplicationService,
    },
  ],
})
export class UserModule {}
