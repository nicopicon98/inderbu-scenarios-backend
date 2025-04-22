import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IUserRepositoryPort } from 'src/core/domain/ports/outbound/user-repository.port';
import { UserEntityMapper } from 'src/infrastructure/mappers/user/user-entity.mapper';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { UserEntity } from '../../../persistence/user.entity';

@Injectable()
export class UserRepositoryAdapter
  extends BaseRepositoryAdapter<UserEntity, UserDomainEntity>
  implements IUserRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.USER)
    repository: Repository<UserEntity>,
  ) {
    super(repository, ['role', 'neighborhood']);
  }

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
    if (!userEntity) return null;
    return this.toDomain(userEntity);
  }

  async findByConfirmationToken(token: string): Promise<UserDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { confirmationToken: token },
    });
    if (!entity) return null;
    return this.toDomain(entity);
  }
}
