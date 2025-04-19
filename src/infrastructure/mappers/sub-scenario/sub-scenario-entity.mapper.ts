import { SubScenarioEntity } from 'src/infrastructure/persistence/sub-scenario.entity';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';

export class SubScenarioEntityMapper {
  static toDomain(entity: SubScenarioEntity): SubScenarioDomainEntity {
    return SubScenarioDomainEntity.builder()
      .withId(entity.id)
      .withName(entity.name)
      .withHasCost(entity.hasCost)
      .withnumberOfSpectators(entity.numberOfSpectators)
      .withNumberOfPlayers(entity.numberOfPlayers)
      .withRecommendations(entity.recommendations)
      .withScenarioId(entity.scenario ? entity.scenario.id : 1)
      .withActivityAreaId(entity.activityArea ? entity.activityArea.id : 1)
      .withFieldSurfaceTypeId(entity.fieldSurfaceType ? entity.fieldSurfaceType.id : 1)
      .build();
  }

  static toEntity(domain: SubScenarioDomainEntity): SubScenarioEntity {
    const entity = new SubScenarioEntity();
    if (domain.id !== null) entity.id = domain.id;
    entity.name = domain.name;
    entity.hasCost = domain.hasCost;
    entity.numberOfSpectators = domain.numberOfSpectators ?? 0;
    entity.numberOfPlayers = domain.numberOfPlayers ?? 0;
    entity.recommendations = domain.recommendations ?? '';
    // Se crean instancias mínimas para las relaciones mediante el id
    entity.scenario = { id: domain.scenarioId } as any;
    if (domain.activityAreaId) {
      entity.activityArea = { id: domain.activityAreaId } as any;
    }
    if (domain.fieldSurfaceTypeId) {
      entity.fieldSurfaceType = { id: domain.fieldSurfaceTypeId } as any;
    }
    return entity;
  }
}
