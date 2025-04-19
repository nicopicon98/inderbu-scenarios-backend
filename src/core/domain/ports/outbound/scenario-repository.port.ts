import { ScenarioDomainEntity } from "../../entities/scenario.domain-entity";
import { SubScenarioDomainEntity } from "../../entities/sub-scenario.domain-entity";

export interface IScenarioRepositoryPort {
  findById(id: number): Promise<ScenarioDomainEntity | null>;
  findByIds(ids: number[]): Promise<ScenarioDomainEntity[]>;
}
