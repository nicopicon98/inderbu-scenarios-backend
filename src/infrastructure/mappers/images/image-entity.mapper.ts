import { SubScenarioEntity } from 'src/infrastructure/persistence/sub-scenario.entity';
import { SubScenarioImageEntity } from 'src/infrastructure/persistence/image.entity';
import { SubScenarioImageDomainEntity } from 'src/core/domain/entities/sub-scenario-image.domain-entity';

export class SubScenarioImageEntityMapper {
  static toDomain(entity: SubScenarioImageEntity): SubScenarioImageDomainEntity {
    return SubScenarioImageDomainEntity.builder()
      .withId(entity.id)
      .withPath(entity.path)
      .withIsFeature(entity.isFeature)
      .withDisplayOrder(entity.displayOrder)
      .withSubScenarioId(entity.subScenario?.id)
      .withCreatedAt(entity.createdAt)
      .build();
  }

  static toPersistence(
    domain: SubScenarioImageDomainEntity,
  ): SubScenarioImageEntity {
    const entity = new SubScenarioImageEntity();
    
    if (domain.id !== null) {
      entity.id = domain.id;
    }
    
    entity.path = domain.path;
    entity.isFeature = domain.isFeature;
    entity.displayOrder = domain.displayOrder;
    entity.createdAt = domain.createdAt || new Date();
    
    // Crear una referencia al sub-escenario
    const subScenario = new SubScenarioEntity();
    subScenario.id = domain.subScenarioId;
    entity.subScenario = subScenario;
    
    return entity;
  }
}
