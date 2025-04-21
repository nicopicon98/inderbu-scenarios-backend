import { Injectable, Inject, NotFoundException } from '@nestjs/common';

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
    const { data: subs, total } =
      await this.subScenarioRepository.findPaged(opts); // 1. dominio
    const [scen, area, surf, neigh] = await this.loadReferenceMaps(subs); // 2. catálogos
    const dto = subs.map((s) =>
      SubScenarioMapper.toDto(s, scen, area, surf, neigh),
    );
    console.log('DTO', dto);
    return new PageDto(
      dto,
      new PageMetaDto({
        page: opts.page,
        limit: opts.limit,
        totalItems: total,
      }),
    );
  }


  async getByIdWithRelations(
    id: number,
  ): Promise<SubScenarioWithRelationsDto | null> {
    const sub: SubScenarioDomainEntity | null = await this.subScenarioRepository.findByIdWithRelations(id);
    if (!sub) throw new NotFoundException(`SubScenario ${id} no encontrado`);
    const [ scenMap, areaMap, surfMap, neighMap ] = await this.loadReferenceMaps([sub]);
    return SubScenarioMapper.toDto(sub, scenMap, areaMap, surfMap, neighMap);
  }

  private async loadReferenceMaps(subs: SubScenarioDomainEntity[]) {
    // 1. Extraer listados de IDs (numbers), filtrando nulos
    const scenarioIds = uniq(subs.map((s) => s.scenarioId));
    const activityAreaIds = uniq(subs
      .map((s) => s.activityAreaId)
      .filter((id): id is number => id != null)
    );
    const fieldSurfaceTypeIds = uniq(subs
      .map((s) => s.fieldSurfaceTypeId)
      .filter((id): id is number => id != null)
    );
  
    // 2. Cargar las entidades de cada repositorio en paralelo
    const [scenarios, activityAreas, fieldSurfaces] = await Promise.all([
      this.scenarioRepository.findByIds(scenarioIds),
      this.activityAreaareaRepository.findByIds(activityAreaIds),
      this.fieldSurfaceRepository.findByIds(fieldSurfaceTypeIds),
    ]);
  
    // 3. Ahora que ya tienes los escenarios, extrae los barrios
    const neighborhoodIds = uniq(
      scenarios
        .map((sc) => sc.neighborhoodId)
        .filter((id): id is number => id != null)
    );
    const neighborhoods = await this.neighborhoodRepository.findByIds(
      neighborhoodIds
    );
  
    // 4. Construye tus mapas
    return [
      toMap(scenarios),         // Map<scenarioId, ScenarioDomainEntity>
      toMap(activityAreas),     // Map<activityAreaId, ActivityAreaDomainEntity>
      toMap(fieldSurfaces),     // Map<fieldSurfaceTypeId, FieldSurfaceTypeDomainEntity>
      toMap(neighborhoods),     // Map<neighborhoodId, NeighborhoodDomainEntity>
    ] as const;
  }
  
}
