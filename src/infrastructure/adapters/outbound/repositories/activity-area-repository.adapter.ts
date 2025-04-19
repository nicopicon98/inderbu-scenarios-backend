import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { IActivityAreaRepositoryPort } from "src/core/domain/ports/outbound/activity-area-repository.port";
import { ActivityAreaEntity } from "src/infrastructure/persistence/activity-area.entity";
import { ActivityAreaEntityMapper } from "src/infrastructure/mappers/activity-area/activity-area-entity.mapper";
import { ActivityAreaDomainEntity } from "src/core/domain/entities/activity-area.domain-entity";

@Injectable()
export class ActivityAreaRepositoryAdapter implements IActivityAreaRepositoryPort {
  constructor(
    @Inject('ACTIVITY_AREA_REPOSITORY')
    private readonly ormRepo: Repository<ActivityAreaEntity>,
  ) {}

  async findById(id: number) {
    const e = await this.ormRepo.findOne({ where: { id } });
    return e ? ActivityAreaEntityMapper.toDomain(e) : null;
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.ormRepo.findByIds(ids);
    return list.map(ActivityAreaEntityMapper.toDomain);
  }

  async save(d: ActivityAreaDomainEntity) {
    await this.ormRepo.save(ActivityAreaEntityMapper.toEntity(d));
  }
}
