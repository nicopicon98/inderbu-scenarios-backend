import { Inject, Injectable } from '@nestjs/common';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { IUserRepositoryPort } from 'src/core/domain/ports/outbound/user-repository.port';
import { UserEntityMapper } from 'src/infrastructure/mappers/user/user-entity.mapper';
import { UserDomainEntity } from 'src/core/domain/entities/user.domain-entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { UserEntity } from '../../../persistence/user.entity';

const DEFAULT_RELATIONS = [
  'role',
  'neighborhood',
  'neighborhood.commune',
  'neighborhood.commune.city',
] as const;

@Injectable()
export class UserRepositoryAdapter
  extends BaseRepositoryAdapter<UserEntity, UserDomainEntity>
  implements IUserRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.USER)
    repository: Repository<UserEntity>,
  ) {
    super(repository, [...DEFAULT_RELATIONS]);
  }

  protected toEntity(domain: UserDomainEntity): UserEntity {
    return UserEntityMapper.toEntity(domain);
  }

  protected toDomain(entity: UserEntity): UserDomainEntity {
    return UserEntityMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<UserDomainEntity | null> {
    const userEntity = await this.repository.findOne({
      where: { email },
      relations: [...DEFAULT_RELATIONS],
    });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByConfirmationToken(
    token: string,
  ): Promise<UserDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { confirmationToken: token },
      relations: [...DEFAULT_RELATIONS],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAllPaged(pageOptionsDto: PageOptionsDto) {
    const { page, limit, search } = pageOptionsDto;
    const skip = (page - 1) * limit;

    let whereCondition: FindOptionsWhere<UserEntity>[] = [];

    if (search) {
      const like = Like(`%${search}%`);
      whereCondition = [
        { first_name: like },
        { last_name: like },
        { email: like },
      ];

      if (!isNaN(Number(search))) {
        whereCondition.push({ dni: Number(search) } as any);
      }
    }

    const [users, totalItems] = await this.repository.findAndCount({
      where: whereCondition.length ? whereCondition : {},
      relations: [...DEFAULT_RELATIONS],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    console.log({users});

    return {
      users: users.map((e) => this.toDomain(e)),
      totalItems,
    };
  }

  async findByRole(
    roleId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ users: UserDomainEntity[]; totalItems: number }> {
    const { page, limit, search } = pageOptionsDto;
    const skip = (page - 1) * limit;

    let whereCondition:
      | FindOptionsWhere<UserEntity>
      | FindOptionsWhere<UserEntity>[] = {
      role: { id: roleId },
    };

    if (search) {
      whereCondition = [
        { first_name: Like(`%${search}%`), role: { id: roleId } },
        { last_name: Like(`%${search}%`), role: { id: roleId } },
        { email: Like(`%${search}%`), role: { id: roleId } },
        { dni: Like(`%${search}%`), role: { id: roleId } },
      ] as any;
    }

    const [users, totalItems] = await this.repository.findAndCount({
      where: whereCondition,
      relations: [...DEFAULT_RELATIONS],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      users: users.map((entity) => this.toDomain(entity)),
      totalItems,
    };
  }

  async findByIdWithRelations(id: number): Promise<UserDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [...DEFAULT_RELATIONS],
    });

    return entity ? this.toDomain(entity) : null;
  }
}
