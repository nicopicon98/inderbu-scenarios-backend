import { Inject, Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';

import { FieldSurfaceTypeEntityMapper } from 'src/infrastructure/mappers/field-surface-type/field-surface-type-entity.mapper';
import { IFieldSurfaceTypeRepositoryPort } from 'src/core/domain/ports/outbound/field-surface-type-repository.port';
import { FieldSurfaceTypeDomainEntity } from 'src/core/domain/entities/field-surface-type.domain-entity';
import { FieldSurfaceTypeEntity } from 'src/infrastructure/persistence/field-surface-type.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';

@Injectable()
export class FieldSurfaceTypeRepositoryAdapter
  implements IFieldSurfaceTypeRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.FIELD_SURFACE_TYPE)
    private readonly repository: Repository<FieldSurfaceTypeEntity>,
  ) {}

  async findById(id: number) {
    const e = await this.repository.findOne({ where: { id } });
    return e ? FieldSurfaceTypeEntityMapper.toDomain(e) : null;
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.repository.findBy({ id: In(ids) });
    return list.map(FieldSurfaceTypeEntityMapper.toDomain);
  }

  async save(d: FieldSurfaceTypeDomainEntity) {
    await this.repository.save(FieldSurfaceTypeEntityMapper.toEntity(d));
  }
}
