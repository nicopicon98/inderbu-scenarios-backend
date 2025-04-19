import { Inject, Injectable } from '@nestjs/common';

import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { INeighborhoodApplicationPort } from '../ports/inbound/neighborhood-application.port';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

@Injectable()
export class NeighborhoodApplicationService
  implements INeighborhoodApplicationPort
{
  constructor(
    @Inject(REPOSITORY_PORTS.NEIGHBORHOOD)
    private readonly repo: INeighborhoodRepositoryPort,
  ) {}

  listAll(): Promise<NeighborhoodDomainEntity[]> {
    return this.repo.findAll();
  }
}
