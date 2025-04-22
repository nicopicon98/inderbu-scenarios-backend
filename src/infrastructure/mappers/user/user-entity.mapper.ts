import { UserEntity } from 'src/infrastructure/persistence/user.entity';
import {
  UserDomainEntity,
} from 'src/core/domain/entities/user.domain-entity';
import { RoleEntity } from 'src/infrastructure/persistence/role.entity';

export class UserEntityMapper {
  static toDomain(entity: UserEntity): UserDomainEntity {
    return UserDomainEntity.builder()
      .withId(entity.id)
      .withDni(entity.dni)
      .withFirstName(entity.first_name)
      .withLastName(entity.last_name)
      .withEmail(entity.email)
      .withPhone(entity.phone)
      .withPasswordHash(entity.password) // Se asume que en la entidad se guarda el hash
      .withRoleId(entity.role?.id) // Se asigna el ID del rol
      .withAddress(entity.address)
      .withNeighborhoodId(entity.neighborhood?.id)
      .withIsActive(entity.isActive)
      .withConfirmationToken(entity.confirmationToken)
      .withConfirmationTokenExpiresAt(entity.confirmationTokenExpiresAt)
      .build();
  }

  static toEntity(domain: UserDomainEntity): UserEntity {
    const entity = new UserEntity();
    if (domain.id !== null) entity.id = domain.id;
    entity.dni = domain.dni;
    entity.first_name = domain.firstName;
    entity.last_name = domain.lastName;
    entity.email = domain.email;
    entity.phone = domain.phone;
    entity.password = (domain as any)['passwordHash'];
    entity.role = { id: domain.roleId } as RoleEntity;
    entity.address = domain.address;
    entity.neighborhood = { id: domain.neighborhoodId } as any;
    entity.isActive = domain.isActive;
    entity.confirmationToken = (domain as any).confirmationToken;
    entity.confirmationTokenExpiresAt = (domain as any).confirmationTokenExpiresAt;
    return entity;
  }
}
