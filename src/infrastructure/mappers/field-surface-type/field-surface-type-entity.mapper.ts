import { FieldSurfaceTypeDomainEntity } from "src/core/domain/entities/field-surface-type.domain-entity";
import { FieldSurfaceTypeEntity } from "src/infrastructure/persistence/field-surface-type.entity";

export class FieldSurfaceTypeEntityMapper {
  static toDomain(e: FieldSurfaceTypeEntity): FieldSurfaceTypeDomainEntity {
    return new FieldSurfaceTypeDomainEntity(e.id, e.name);
  }
  static toEntity(d: FieldSurfaceTypeDomainEntity): FieldSurfaceTypeEntity {
    const e = new FieldSurfaceTypeEntity();
    if (d.id) e.id = d.id;
    e.name = d.name;
    return e;
  }
}
