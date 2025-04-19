// src/infrastructure/mappers/field-surface-type/field-surface-type-entity.mapper.ts
import { FieldSurfaceTypeEntity } from 'src/infrastructure/persistence/field-surface-type.entity';
import {
  FieldSurfaceTypeDomainEntity,
  FieldSurfaceTypeDomainBuilder,
} from 'src/core/domain/entities/field-surface-type.domain-entity';

export class FieldSurfaceTypeEntityMapper {
  static toDomain(e: FieldSurfaceTypeEntity): FieldSurfaceTypeDomainEntity {
    return FieldSurfaceTypeDomainEntity.builder()
      .withId(e.id)
      .withName(e.name)
      .build();
  }

  static toEntity(d: FieldSurfaceTypeDomainEntity): FieldSurfaceTypeEntity {
    const e = new FieldSurfaceTypeEntity();
    if (d.id != null) {
      e.id = d.id;
    }
    e.name = d.name;
    return e;
  }
}
