import { NeighborhoodDomainEntity } from '../../../domain/entities/neighborhood.domain-entity';

export interface INeighborhoodApplicationPort {
  listAll(): Promise<NeighborhoodDomainEntity[]>;
}
