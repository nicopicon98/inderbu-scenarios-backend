import { Inject, Injectable } from '@nestjs/common';

import { IActivityAreaRepositoryPort } from 'src/core/domain/ports/outbound/activity-area-repository.port';
import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';
import { IActivityAreaApplicationPort } from '../ports/inbound/activity-area-application.port';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

@Injectable()
export class ActivityAreaApplicationService
  implements IActivityAreaApplicationPort
{
  constructor(
    @Inject(REPOSITORY_PORTS.ACTIVITY_AREA)
    private readonly repo: IActivityAreaRepositoryPort,
  ) {}

  listAll(): Promise<ActivityAreaDomainEntity[]> {
    return this.repo.findAll();
  }
}
