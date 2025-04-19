import { Inject, Injectable } from '@nestjs/common';
import { IActivityAreaApplicationPort } from '../ports/inbound/activity-area-application.port';
import { IActivityAreaRepositoryPort } from 'src/core/domain/ports/outbound/activity-area-repository.port';
import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';

@Injectable()
export class ActivityAreaApplicationService
  implements IActivityAreaApplicationPort
{
  constructor(
    @Inject('IActivityAreaRepositoryPort')
    private readonly repo: IActivityAreaRepositoryPort,
  ) {}

  listAll(): Promise<ActivityAreaDomainEntity[]> {
    return this.repo.findAll();
  }
}
