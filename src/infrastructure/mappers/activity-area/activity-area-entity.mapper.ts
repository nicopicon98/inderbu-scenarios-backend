import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';
import { ActivityAreaEntity } from 'src/infrastructure/persistence/activity-area.entity';

export class ActivityAreaEntityMapper {
  static toDomain(e: ActivityAreaEntity): ActivityAreaDomainEntity {
    return new ActivityAreaDomainEntity(e.id, e.name);
  }
  static toEntity(d: ActivityAreaDomainEntity): ActivityAreaEntity {
    const e = new ActivityAreaEntity();
    if (d.id) e.id = d.id;
    e.name = d.name;
    return e;
  }
}
