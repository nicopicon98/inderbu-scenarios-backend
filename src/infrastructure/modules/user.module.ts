import { Module } from '@nestjs/common';
import { UserController } from '../adapters/inbound/http/controllers/user.controller';
import { UserApplicationService } from 'src/core/application/services/user-application.service';
import { UserRepositoryAdapter } from '../adapters/outbound/repositories/user-repository.adapter';
import { UserEntity } from '../persistence/user.entity';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './database/database.module';
import { MYSQL_DATA_SOURCE } from '../providers/database/database.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserApplicationPort',
      useClass: UserApplicationService,
    },
    {
      provide: 'IUserRepositoryPort',
      useClass: UserRepositoryAdapter,
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserEntity),
      inject: [MYSQL_DATA_SOURCE],
    },
  ],
})
export class UserModule {}
