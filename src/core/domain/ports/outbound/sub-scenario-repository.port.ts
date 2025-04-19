import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { SubScenarioEntity } from 'src/infrastructure/persistence/sub-scenario.entity';

export interface ISubScenarioRepositoryPort {
  findPaged(opts: PageOptionsDto): Promise<{ data: SubScenarioDomainEntity[]; total: number }>;
}
