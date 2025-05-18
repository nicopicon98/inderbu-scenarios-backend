import { NeighborhoodDomainEntity } from '../../entities/neighborhood.domain-entity';
import { PageOptionsDto } from '../../../../infrastructure/adapters/inbound/http/dtos/common/page-options.dto';

export interface INeighborhoodRepositoryPort {
  findAll(): Promise<NeighborhoodDomainEntity[]>;
  findByIds(ids: number[]): Promise<NeighborhoodDomainEntity[]>;
  findPaged(opts: PageOptionsDto): Promise<{ data: NeighborhoodDomainEntity[]; total: number }>;
}
