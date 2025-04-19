import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { IUserApplicationPort } from '../ports/inbound/user-application.port';
import { APPLICATION_PORTS } from '../tokens/ports';

@Injectable()
export class AuthApplicationService {
  constructor(
    @Inject(APPLICATION_PORTS.USER)
    private readonly userApplicationService: IUserApplicationPort,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDomainEntity | null> {
    const user = await this.userApplicationService.findByEmail(email);
    if ( user && (await bcrypt.compare(password, (user as any)['passwordHash']))) {
      return user;
    }
    return null;
  }

  async login(user: UserDomainEntity): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, role: user.roleId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
