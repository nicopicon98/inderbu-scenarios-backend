import { Injectable } from '@nestjs/common';
import { AppServiceInterface } from './app.interface';

@Injectable()
export class AppService implements AppServiceInterface{
  getHello(): string {
    return 'Hello World!';
  }
}
