import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';
import { ScenarioEntity } from 'src/infrastructure/persistence/scenario.entity';

export class ScenarioEntityMapper {
  static toDomain(e: ScenarioEntity): ScenarioDomainEntity {
    return new ScenarioDomainEntity(e.id, e.name, e.address);
  }
  static toEntity(d: ScenarioDomainEntity): ScenarioEntity {
    return Object.assign(new ScenarioEntity(), {
      id: d.id ?? undefined,
      name: d.name,
      address: d.address,
    });
  }
}
