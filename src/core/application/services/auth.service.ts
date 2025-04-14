import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { IUserApplicationPort } from '../ports/inbound/user-application.port';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IUserApplicationPort')
    private readonly userApplicationService: IUserApplicationPort,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDomainEntity | null> {
    const user = await this.userApplicationService.findByEmail(email);
    if (
      user &&
      (await bcrypt.compare(password, (user as any)['passwordHash']))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDomainEntity): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    console.log(payload);
    // Si el objeto jwtService expone la configuración, podría verse algo así:
    console.log('JwtService options:', (this.jwtService as any).options);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
