import { ScenarioDomainEntity } from '../../../domain/entities/scenario.domain-entity';
import { PageOptionsDto } from '../../../../infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { PageDto } from '../../../../infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { ScenarioResponseDto } from '../../../../infrastructure/adapters/inbound/http/dtos/scenario/scenario-response.dto';

export interface IScenarioApplicationPort {
  listAll(): Promise<ScenarioDomainEntity[]>;
  getById(id: number): Promise<ScenarioDomainEntity | null>;
  listPaged(opts: PageOptionsDto): Promise<PageDto<ScenarioResponseDto>>;
}
