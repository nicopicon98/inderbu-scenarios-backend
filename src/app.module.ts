import { Module } from '@nestjs/common';

import { AuthModule } from './auth.module';
import { AppCommandModule } from './command.module';

@Module({
  imports: [
    AuthModule,
    AppCommandModule
  ]
})
export class AppModule {}
