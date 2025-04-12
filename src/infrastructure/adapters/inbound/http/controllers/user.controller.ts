import { Controller, Get, Inject } from '@nestjs/common';
import { IUserApplicationPort } from 'src/core/application/ports/inbound/user-application.port';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserApplicationPort')
    private readonly userApplicationService: IUserApplicationPort,
  ) {}

  @Get()
  getUsers(): string {
    return 'pepito';
  }
}
