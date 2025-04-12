import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import { JwtService } from '@nestjs/jwt';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IUserRepositoryPort')
    private readonly userRepository: IUserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  // Valida las credenciales del usuario
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDomainEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user['password']))) {
      // Se asume que el password del dominio se encuentra almacenado internamente
      return user;
    }
    return null;
  }

  // Genera el token JWT con los datos necesarios
  async login(user: UserDomainEntity): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
