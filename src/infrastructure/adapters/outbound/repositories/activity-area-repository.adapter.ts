import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { ActivityAreaEntityMapper } from 'src/infrastructure/mappers/activity-area/activity-area-entity.mapper';
import { IActivityAreaRepositoryPort } from 'src/core/domain/ports/outbound/activity-area-repository.port';
import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';
import { ActivityAreaEntity } from 'src/infrastructure/persistence/activity-area.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';

@Injectable()
export class ActivityAreaRepositoryAdapter
  implements IActivityAreaRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.ACTIVITY_AREA)
    private readonly repository: Repository<ActivityAreaEntity>,
  ) {}

  async findById(id: number) {
    const e = await this.repository.findOne({ where: { id } });
    return e ? ActivityAreaEntityMapper.toDomain(e) : null;
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.repository.findBy({ id: In(ids) });
    return list.map(ActivityAreaEntityMapper.toDomain);
  }

  async save(d: ActivityAreaDomainEntity) {
    await this.repository.save(ActivityAreaEntityMapper.toEntity(d));
  }

  async findAll(): Promise<ActivityAreaDomainEntity[]> {
    const list = await this.repository.find({ order: { name: 'ASC' } });
    return list.map(ActivityAreaEntityMapper.toDomain);
  }
}
