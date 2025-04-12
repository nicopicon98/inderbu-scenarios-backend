// infrastructure/adapters/outbound/repositories/user-repository.adapter.ts

import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../persistence/user.entity';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { IUserRepositoryPort } from 'src/core/domain/ports/outbound/user-repository.port';

@Injectable()
export class UserRepositoryAdapter
  extends BaseRepositoryAdapter<UserEntity, UserDomainEntity>
  implements IUserRepositoryPort
{
  constructor(
    @Inject('USER_REPOSITORY')
    repository: Repository<UserEntity>,
  ) {
    // Indicamos que al cargar un usuario se incluyan las relaciones necesarias.
    super(repository, ['role', 'neighborhood']);
  }

  // Mapea el modelo de dominio a la entidad de persistencia
  protected toEntity(domain: UserDomainEntity): UserEntity {
    const entity = new UserEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.dni = domain.dni;
    entity.first_name = domain.firstName;
    entity.last_name = domain.lastName;
    entity.email = domain.email;
    entity.phone = domain.phone;
    // Asumimos que el password ya está hasheado en el dominio.
    entity.password = (domain as any).passwordHash;
    // Aquí es necesario convertir el role y neighborhood:
    // Supongamos que en la persistencia se requiere un objeto RoleEntity, pero en el dominio tenemos un string.
    // La conversión dependerá de tu lógica de negocio. Por ejemplo:
    entity.role = { name: domain.role } as any; // Ajusta según tu modelo de RoleEntity.
    entity.address = domain.address;
    // Similarmente, convertimos neighborhoodId a una instancia de NeighborhoodEntity.
    entity.neighborhood = { id: domain.neighborhoodId } as any;
    return entity;
  }

  protected toDomain(entity: UserEntity): UserDomainEntity {
    return UserDomainEntity.builder()
      .withId(entity.id)
      .withDni(entity.dni)
      .withFirstName(entity.first_name)
      .withLastName(entity.last_name)
      .withEmail(entity.email)
      .withPhone(entity.phone)
      .withPasswordHash(entity.password)
      // Convertimos RoleEntity a string (por ejemplo, su nombre)
      .withRole((entity.role && (entity.role as any).name) || '')
      .withAddress(entity.address)
      // Convertimos la relación neighborhood a su ID
      .withNeighborhoodId((entity.neighborhood && (entity.neighborhood as any).id) || 0)
      .build();
  }

  async findByEmail(email: string): Promise<UserDomainEntity | null> {
    const userEntity = await this.repository.findOne({
      where: { email },
      relations: this.relations,
    });
    if (!userEntity) return null;
    return this.toDomain(userEntity);
  }
}
