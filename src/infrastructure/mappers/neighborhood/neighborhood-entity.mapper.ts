import { NeighborhoodEntity } from '../../persistence/neighborhood.entity';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';

export class NeighborhoodEntityMapper {
  static toDomain(e: NeighborhoodEntity): NeighborhoodDomainEntity {
    return new NeighborhoodDomainEntity(e.id, e.name);
  }
}
