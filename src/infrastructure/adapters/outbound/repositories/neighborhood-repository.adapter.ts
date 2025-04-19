import { Injectable, Inject } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { NeighborhoodEntityMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-entity.mapper';
import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { NeighborhoodEntity } from '../../../persistence/neighborhood.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';

@Injectable()
export class NeighborhoodRepositoryAdapter
  extends BaseRepositoryAdapter<NeighborhoodEntity, NeighborhoodDomainEntity>
  implements INeighborhoodRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.NEIGHBORHOOD)
    repo: Repository<NeighborhoodEntity>,
  ) {
    super(repo, ['commune']);
  }

  protected toDomain(entity: NeighborhoodEntity): NeighborhoodDomainEntity {
    return NeighborhoodEntityMapper.toDomain(entity);
  }

  protected toEntity(): NeighborhoodEntity {
    throw new Error('Only read operations supported');
  }

  async findAll(): Promise<NeighborhoodDomainEntity[]> {
    const list = await this.repository.find({ order: { name: 'ASC' } });
    return list.map(NeighborhoodEntityMapper.toDomain);
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.repository.findBy({ id: In(ids) });
    return list.map(NeighborhoodEntityMapper.toDomain);
  }
}
