import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { AppServiceInterface } from './app.interface';

@Controller()
export class AppController {
  constructor(
    @Inject('AppServiceInterface')
    private readonly appService: AppServiceInterface
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
