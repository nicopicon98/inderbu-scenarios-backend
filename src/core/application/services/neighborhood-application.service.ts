import { Inject, Injectable } from '@nestjs/common';
import { INeighborhoodApplicationPort } from '../ports/inbound/neighborhood-application.port';
import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';

@Injectable()
export class NeighborhoodApplicationService
  implements INeighborhoodApplicationPort
{
  constructor(
    @Inject('INeighborhoodRepositoryPort')
    private readonly repo: INeighborhoodRepositoryPort,
  ) {}

  listAll(): Promise<NeighborhoodDomainEntity[]> {
    return this.repo.findAll();
  }
}
