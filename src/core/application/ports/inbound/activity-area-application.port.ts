import { ActivityAreaDomainEntity } from '../../../domain/entities/activity-area.domain-entity';
import { PageOptionsDto } from "../../../../infrastructure/adapters/inbound/http/dtos/common/page-options.dto";
import { PageDto } from "../../../../infrastructure/adapters/inbound/http/dtos/common/page.dto";
import { ActivityAreaResponseDto } from "../../../../infrastructure/adapters/inbound/http/dtos/activity-area/activity-area-response.dto";

export interface IActivityAreaApplicationPort {
  listAll(): Promise<ActivityAreaDomainEntity[]>;
  listPaged(opts: PageOptionsDto): Promise<PageDto<ActivityAreaResponseDto>>;
}
