import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { FieldSurfaceTypeEntityMapper } from 'src/infrastructure/mappers/field-surface-type/field-surface-type-entity.mapper';
import { IFieldSurfaceTypeRepositoryPort } from 'src/core/domain/ports/outbound/field-surface-type-repository.port';
import { FieldSurfaceTypeDomainEntity } from 'src/core/domain/entities/field-surface-type.domain-entity';
import { FieldSurfaceTypeEntity } from 'src/infrastructure/persistence/field-surface-type.entity';

@Injectable()
export class FieldSurfaceTypeRepositoryAdapter
  implements IFieldSurfaceTypeRepositoryPort
{
  constructor(
    @Inject('FIELD_SURFACE_TYPE_REPOSITORY')
    private readonly ormRepo: Repository<FieldSurfaceTypeEntity>,
  ) {}

  async findById(id: number) {
    const e = await this.ormRepo.findOne({ where: { id } });
    return e ? FieldSurfaceTypeEntityMapper.toDomain(e) : null;
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.ormRepo.findByIds(ids);
    return list.map(FieldSurfaceTypeEntityMapper.toDomain);
  }

  async save(d: FieldSurfaceTypeDomainEntity) {
    await this.ormRepo.save(FieldSurfaceTypeEntityMapper.toEntity(d));
  }
}
