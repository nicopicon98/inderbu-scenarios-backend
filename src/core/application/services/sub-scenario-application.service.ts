import { Injectable, Inject } from '@nestjs/common';

import {
  SubScenarioMapper,
  toMap,
  uniq,
} from 'src/infrastructure/mappers/sub-scenario/sub-scenario.mapper';
import {
  PageDto,
  PageMetaDto,
} from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { SubScenarioWithRelationsDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/sub-scenario-response-with-relations.dto';
import { IFieldSurfaceTypeRepositoryPort } from 'src/core/domain/ports/outbound/field-surface-type-repository.port';
import { IActivityAreaRepositoryPort } from 'src/core/domain/ports/outbound/activity-area-repository.port';
import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { ISubScenarioRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-repository.port';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { IScenarioRepositoryPort } from 'src/core/domain/ports/outbound/scenario-repository.port';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { ISubScenarioApplicationPort } from '../ports/inbound/sub-scenario-application.port';
import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

@Injectable()
export class SubScenarioApplicationService
  implements ISubScenarioApplicationPort
{
  constructor(
    @Inject(REPOSITORY_PORTS.SUB_SCENARIO)
    private readonly subScenarioRepository: ISubScenarioRepositoryPort,
    @Inject(REPOSITORY_PORTS.SCENARIO)
    private readonly scenarioRepository: IScenarioRepositoryPort,
    @Inject(REPOSITORY_PORTS.ACTIVITY_AREA)
    private readonly activityAreaareaRepository: IActivityAreaRepositoryPort,
    @Inject(REPOSITORY_PORTS.FIELD_SURFACE)
    private readonly fieldSurfaceRepository: IFieldSurfaceTypeRepositoryPort,
    @Inject(REPOSITORY_PORTS.NEIGHBORHOOD)
    private readonly neighborhoodRepository: INeighborhoodRepositoryPort, // <‑‑
  ) {}

  async listWithRelations(
    opts: PageOptionsDto,
  ): Promise<PageDto<SubScenarioWithRelationsDto>> {
    const { data: subs, total } = await this.subScenarioRepository.findPaged(opts); // 1. dominio
    const [scen, area, surf, neigh] = await this.loadReferenceMaps(subs); // 2. catálogos
    const dto = subs.map((s) =>
      SubScenarioMapper.toDto(s, scen, area, surf, neigh),
    );
    return new PageDto(
      dto,
      new PageMetaDto({
        page: opts.page,
        limit: opts.limit,
        totalItems: total,
      }),
    );
  }

  private async loadReferenceMaps(subs: SubScenarioDomainEntity[]) {
    const scenIds: number[] = uniq(subs.map((s) => s.scenarioId));
    const areaIds: number[] = uniq(subs.flatMap((s) => s.activityAreaId ?? []));
    const surfIds: number[] = uniq(
      subs.flatMap((s) => s.fieldSurfaceTypeId ?? []),
    );

    const scenarios: ScenarioDomainEntity[] =
      await this.scenarioRepository.findByIds(scenIds);

    /* ids de barrios presentes en esos escenarios */
    const neighIds: number[] = uniq(scenarios.flatMap((sc) => sc.neighborhoodId ?? []));

    const [areas, surfs, neighs] = await Promise.all([
      this.activityAreaareaRepository.findByIds(areaIds),
      this.fieldSurfaceRepository.findByIds(surfIds),
      this.neighborhoodRepository.findByIds(neighIds),
    ]);

    return [
      toMap(scenarios),
      toMap(areas),
      toMap(surfs),
      toMap(neighs),
    ] as const;
  }
}
