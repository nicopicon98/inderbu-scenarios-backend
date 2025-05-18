import { plainToInstance } from 'class-transformer';

import { UserWithRelationsDto } from 'src/infrastructure/adapters/inbound/http/dtos/user/user-with-relations.dto';
import { UserResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/user/create-user-response.dto';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';

export class UserResponseMapper {
  static toDto(domain: UserDomainEntity): UserResponseDto {
    return plainToInstance(UserResponseDto, {
      id: domain.id,
      dni: domain.dni,
      firstName: domain.firstName,
      lastName: domain.lastName,
      email: domain.email,
      phone: domain.phone,
      roleId: domain.roleId,
      address: domain.address,
      neighborhoodId: domain.neighborhoodId,
      isActive: domain.isActive,
    }, { excludeExtraneousValues: true });
  }

  static toDtoWithRelations(domain: UserDomainEntity): UserWithRelationsDto {
    return plainToInstance(UserWithRelationsDto, {
      id: domain.id,
      dni: domain.dni,
      firstName: domain.firstName,
      lastName: domain.lastName,
      email: domain.email,
      phone: domain.phone,
      address: domain.address,
      isActive: domain.isActive,
      role: (domain as any).role,
      neighborhood: (domain as any).neighborhood,
    }, { excludeExtraneousValues: true });
  }
}
