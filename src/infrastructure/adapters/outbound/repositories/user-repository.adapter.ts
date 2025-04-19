import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../persistence/user.entity';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { IUserRepositoryPort } from 'src/core/domain/ports/outbound/user-repository.port';
import { UserEntityMapper } from 'src/infrastructure/mappers/user/user-entity.mapper';

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
    return UserEntityMapper.toEntity(domain);
  }

  protected toDomain(entity: UserEntity): UserDomainEntity {
    return UserEntityMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<UserDomainEntity | null> {
    const userEntity: UserEntity | null = await this.repository.findOne({
      where: { email },
      relations: ['role', 'neighborhood'],
    });
    console.log({ userEntity });
    if (!userEntity) return null;
    return this.toDomain(userEntity);
  }
}
