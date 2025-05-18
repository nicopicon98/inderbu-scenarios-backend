import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { ScenarioResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/scenario/scenario-response.dto';
import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { ScenarioResponseMapper } from 'src/infrastructure/mappers/scenario/scenario-response.mapper';
import { PageDto, PageMetaDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { IScenarioRepositoryPort } from 'src/core/domain/ports/outbound/scenario-repository.port';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';
import { IScenarioApplicationPort } from '../ports/inbound/scenario-application.port';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

@Injectable()
export class ScenarioApplicationService implements IScenarioApplicationPort {
  constructor(
    @Inject(REPOSITORY_PORTS.SCENARIO)
    private readonly scenarioRepository: IScenarioRepositoryPort,
    @Inject(REPOSITORY_PORTS.NEIGHBORHOOD)
    private readonly neighborhoodRepository: INeighborhoodRepositoryPort,
  ) {}

  async listAll(): Promise<ScenarioDomainEntity[]> {
    return this.scenarioRepository.findAll();
  }

  async getById(id: number): Promise<ScenarioDomainEntity | null> {
    return this.scenarioRepository.findById(id);
  }

  async listPaged(opts: PageOptionsDto): Promise<PageDto<ScenarioResponseDto>> {
    const { data: scenarios, total } = await this.scenarioRepository.findPaged(opts);
    
    // Extraer IDs de barrios para cargar
    const neighborhoodIds = scenarios
      .map((s) => s.neighborhoodId)
      .filter((id): id is number => id != null);
    
    // Crear mapa de barrios
    const neighborhoods = new Map<number, NeighborhoodDomainEntity>();
    if (neighborhoodIds.length > 0) {
      const neighList = await this.neighborhoodRepository.findByIds(neighborhoodIds);
      for (const neigh of neighList) {
        if (neigh.id != null) {
          neighborhoods.set(neigh.id, neigh);
        }
      }
    }
    
    // Mapear a DTOs
    const dto = scenarios.map((s) => ScenarioResponseMapper.toDto(s, neighborhoods));
    
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
