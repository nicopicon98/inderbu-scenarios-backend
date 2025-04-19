import { NeighborhoodDomainEntity } from '../../entities/neighborhood.domain-entity';

export interface INeighborhoodRepositoryPort {
  findAll(): Promise<NeighborhoodDomainEntity[]>;
}
