import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { NeighborhoodEntityMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-entity.mapper';
import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { NeighborhoodEntity } from '../../../persistence/neighborhood.entity';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';

@Injectable()
export class NeighborhoodRepositoryAdapter
  extends BaseRepositoryAdapter<NeighborhoodEntity, NeighborhoodDomainEntity>
  implements INeighborhoodRepositoryPort
{
  constructor(
    @Inject('NEIGHBORHOOD_REPOSITORY')
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
}
