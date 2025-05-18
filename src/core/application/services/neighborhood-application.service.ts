import { Inject, Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { PageDto, PageMetaDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { NeighborhoodResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/neighborhood/neighborhood-response.dto';
import { NeighborhoodResponseMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-response.mapper';

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

  async listPaged(opts: PageOptionsDto): Promise<PageDto<NeighborhoodResponseDto>> {
    const { data, total } = await this.repo.findPaged(opts);
    const dto = data.map(NeighborhoodResponseMapper.toDto);

    return new PageDto(
      dto,
      new PageMetaDto({
        page: opts.page,
        limit: opts.limit,
        totalItems: total,
      }),
    );
  }
}
