import { Inject, Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { PageDto, PageMetaDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { ActivityAreaResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/activity-area/activity-area-response.dto';
import { ActivityAreaResponseMapper } from 'src/infrastructure/mappers/activity-area/activity-area-response.mapper';

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

  async listPaged(opts: PageOptionsDto): Promise<PageDto<ActivityAreaResponseDto>> {
    const { data, total } = await this.repo.findPaged(opts);
    const dto = data.map(ActivityAreaResponseMapper.toDto);

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
