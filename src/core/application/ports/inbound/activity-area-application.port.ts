import { ActivityAreaDomainEntity } from '../../../domain/entities/activity-area.domain-entity';

export interface IActivityAreaApplicationPort {
  listAll(): Promise<ActivityAreaDomainEntity[]>;
}
