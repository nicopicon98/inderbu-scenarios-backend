import { ActivityAreaDomainEntity } from '../../entities/activity-area.domain-entity';

export interface IActivityAreaRepositoryPort {
  findById(id: number): Promise<ActivityAreaDomainEntity | null>;
  findByIds(ids: number[]): Promise<ActivityAreaDomainEntity[]>;
  save(entity: ActivityAreaDomainEntity): Promise<void>;
}
