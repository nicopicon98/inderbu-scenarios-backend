import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from 'src/infrastructure/adapters/inbound/http/dtos/user/create-user-request.dto';
import { IUserRepositoryPort } from 'src/core/domain/ports/outbound/user-repository.port';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { IUserApplicationPort } from '../ports/inbound/user-application.port';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

@Injectable()
export class UserApplicationService implements IUserApplicationPort {
  constructor(
    @Inject(REPOSITORY_PORTS.USER)
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDomainEntity> {
    // Se verifica que el correo no esté registrado
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser)
      throw new ConflictException('El correo electrónico ya está registrado');
    
    // Se hashea la contraseña
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    // Se construye el objeto usuario de dominio
    const userDomain = UserDomainEntity.builder()
      .withDni(createUserDto.dni)
      .withFirstName(createUserDto.firstName)
      .withLastName(createUserDto.lastName)
      .withEmail(createUserDto.email)
      .withPhone(createUserDto.phone)
      .withPasswordHash(passwordHash)
      .withRoleId(createUserDto.roleId)
      .withAddress(createUserDto.address)
      .withNeighborhoodId(createUserDto.neighborhoodId)
      .build();
    try {
      return await this.userRepository.save(userDomain);
    } catch (error) {
      console.log({ error });
      throw new ConflictException('Error al guardar el usuario', error);
    }
  }

  async findByEmail(email: string): Promise<UserDomainEntity | null> {
    return this.userRepository.findByEmail(email);
  }
}
