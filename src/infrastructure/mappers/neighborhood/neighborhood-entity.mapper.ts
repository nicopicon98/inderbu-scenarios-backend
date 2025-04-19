// src/infrastructure/mappers/neighborhood/neighborhood-entity.mapper.ts
import { NeighborhoodEntity } from 'src/infrastructure/persistence/neighborhood.entity';
import {
  NeighborhoodDomainEntity,
  NeighborhoodDomainBuilder,
} from 'src/core/domain/entities/neighborhood.domain-entity';

export class NeighborhoodEntityMapper {
  static toDomain(e: NeighborhoodEntity): NeighborhoodDomainEntity {
    return NeighborhoodDomainEntity.builder()
      .withId(e.id)
      .withName(e.name)
      .build();
  }

  static toEntity(d: NeighborhoodDomainEntity): NeighborhoodEntity {
    const e = new NeighborhoodEntity();
    if (d.id != null) {
      e.id = d.id;
    }
    e.name = d.name;
    return e;
  }
}
