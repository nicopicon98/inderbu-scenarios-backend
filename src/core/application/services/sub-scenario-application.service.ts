import { Injectable, Inject } from '@nestjs/common';
import { PORTS } from '../tokens/ports';

import {
  SubScenarioMapper,
  toMap,
  uniq,
} from 'src/infrastructure/mappers/sub-scenario/sub-scenario.mapper';
import { SubScenarioWithRelationsDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/sub-scenario-response-with-relations.dto';
import { IFieldSurfaceTypeRepositoryPort } from 'src/core/domain/ports/outbound/field-surface-type-repository.port';
import { IActivityAreaRepositoryPort } from 'src/core/domain/ports/outbound/activity-area-repository.port';
import { ISubScenarioRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-repository.port';
import { IScenarioRepositoryPort } from 'src/core/domain/ports/outbound/scenario-repository.port';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { ISubScenarioApplicationPort } from '../ports/inbound/sub-scenario-application.port';
import { PageDto, PageMetaDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';

@Injectable()
export class SubScenarioApplicationService
  implements ISubScenarioApplicationPort
{
  constructor(
    @Inject(PORTS.SubScenarioRepo)
    private readonly subRepo: ISubScenarioRepositoryPort,
    @Inject(PORTS.ScenarioRepo)
    private readonly scenarioRepo: IScenarioRepositoryPort,
    @Inject(PORTS.ActivityAreaRepo)
    private readonly areaRepo: IActivityAreaRepositoryPort,
    @Inject(PORTS.FieldSurfaceRepo)
    private readonly fieldSurfaceRepo: IFieldSurfaceTypeRepositoryPort,
  ) {}

  async listWithRelations(opts: PageOptionsDto): Promise<PageDto<SubScenarioWithRelationsDto>> {
    const { data: subs, total } = await this.subRepo.findPaged(opts);   // 1. dominio
    const [scen, area, surf] = await this.loadReferenceMaps(subs);      // 2. catálogos
    const dto = subs.map(s => SubScenarioMapper.toDto(s, scen, area, surf));
    return new PageDto(dto, new PageMetaDto({ page: opts.page, limit: opts.limit, totalItems: total }));
  }

  private async loadReferenceMaps(subs: SubScenarioDomainEntity[]) {
    const scenarioIds: number[] = uniq(subs.map((s) => s.scenarioId));
    const activityAreaIds: number[] = uniq(subs.flatMap((s) => s.activityAreaId ?? []));
    const surfaceTypeIds: number[] = uniq(
      subs.flatMap((s) => s.fieldSurfaceTypeId ?? []),
    );

    const [scenarios, areas, surfaces] = await Promise.all([
      this.scenarioRepo.findByIds(scenarioIds),
      this.areaRepo.findByIds(activityAreaIds),
      this.fieldSurfaceRepo.findByIds(surfaceTypeIds),
    ]);

    return [
      toMap(scenarios), // Map<number, ScenarioDomainEntity>
      toMap(areas), // Map<number, ActivityAreaDomainEntity>
      toMap(surfaces), // Map<number, FieldSurfaceTypeDomainEntity>
    ] as const;
  }
}
