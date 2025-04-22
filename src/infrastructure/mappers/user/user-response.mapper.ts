// src/infrastructure/mappers/user-response.mapper.ts
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { UserResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/user/create-user-response.dto';

export class UserResponseMapper {
  static toDto(userDomain: UserDomainEntity): UserResponseDto {
    return {
      id: userDomain.id!,
      dni: userDomain.dni,
      firstName: userDomain.firstName,
      lastName: userDomain.lastName,
      email: userDomain.email,
      phone: userDomain.phone,
      roleId: userDomain.roleId,
      address: userDomain.address,
      neighborhoodId: userDomain.neighborhoodId,
      isActive: userDomain.isActive
    };
  }
}
