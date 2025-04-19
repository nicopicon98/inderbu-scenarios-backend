import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { PageDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { SubScenarioWithRelationsDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/sub-scenario-response-with-relations.dto';

export interface ISubScenarioApplicationPort {
  listWithRelations(
    opts: PageOptionsDto,
  ): Promise<PageDto<SubScenarioWithRelationsDto>>;
}
