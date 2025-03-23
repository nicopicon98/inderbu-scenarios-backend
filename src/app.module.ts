import { Module } from '@nestjs/common';

import { UserModule } from './infrastructure/modules/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UserModule
  ],
  controllers: [AppController],
  providers: [{
    provide: 'AppServiceInterface',
    useClass: AppService
  }],
})
export class AppModule {}
