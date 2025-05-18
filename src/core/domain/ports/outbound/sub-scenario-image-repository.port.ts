import { SubScenarioImageDomainEntity } from '../../entities/sub-scenario-image.domain-entity';

export interface ISubScenarioImageRepositoryPort {
  save(image: SubScenarioImageDomainEntity): Promise<SubScenarioImageDomainEntity>;
  findBySubScenarioId(subScenarioId: number): Promise<SubScenarioImageDomainEntity[]>;
  findById(id: number): Promise<SubScenarioImageDomainEntity | null>;
  delete(id: number): Promise<boolean>;
  updateOrderAndFeature(images: SubScenarioImageDomainEntity[]): Promise<SubScenarioImageDomainEntity[]>;
}
