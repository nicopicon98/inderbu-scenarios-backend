import { Injectable } from '@nestjs/common';
import { IUserApplicationPort } from '../ports/inbound/user-application.port';

@Injectable()
export class UserApplicationService implements IUserApplicationPort {
  constructor() {}

  getUsers(): {
    id: number;
    name: string;
    email: string;
  }[] {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'jhondoe@email.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'janedoe@email.com',
      },
    ];
  }
}
