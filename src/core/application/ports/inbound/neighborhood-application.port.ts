import { NeighborhoodDomainEntity } from '../../../domain/entities/neighborhood.domain-entity';
import { PageOptionsDto } from "../../../../infrastructure/adapters/inbound/http/dtos/common/page-options.dto";
import { PageDto } from "../../../../infrastructure/adapters/inbound/http/dtos/common/page.dto";
import { NeighborhoodResponseDto } from "../../../../infrastructure/adapters/inbound/http/dtos/neighborhood/neighborhood-response.dto";

export interface INeighborhoodApplicationPort {
  listAll(): Promise<NeighborhoodDomainEntity[]>;
  listPaged(opts: PageOptionsDto): Promise<PageDto<NeighborhoodResponseDto>>;
}
