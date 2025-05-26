import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';

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
import { SubScenarioPageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/sub-scenario-page-options.dto';
import { IScenarioRepositoryPort } from 'src/core/domain/ports/outbound/scenario-repository.port';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { ISubScenarioApplicationPort } from '../ports/inbound/sub-scenario-application.port';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';
import { ISubScenarioImageRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-image-repository.port';
import { CreateSubScenarioDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/create-sub-scenario.dto';
import { UpdateSubScenarioDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/update-sub-scenario.dto';
import { SubScenarioImageDomainEntity } from 'src/core/domain/entities/sub-scenario-image.domain-entity';

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
    private readonly neighborhoodRepository: INeighborhoodRepositoryPort,
    @Inject(REPOSITORY_PORTS.SUB_SCENARIO_IMAGE)
    private readonly imageRepository: ISubScenarioImageRepositoryPort,
  ) {}

  async listWithRelations(
    opts: SubScenarioPageOptionsDto,
  ): Promise<PageDto<SubScenarioWithRelationsDto>> {
    const { data: subs, total } =
      await this.subScenarioRepository.findPaged(opts); // 1. dominio
    console.log('subscenarios response', subs)
    const [scen, area, surf, neigh] = await this.loadReferenceMaps(subs); // 2. catálogos
    
    // Obtener IDs de todos los sub-escenarios
    const subScenarioIds = subs
      .map(s => s.id)
      .filter((id): id is number => id !== null);
    
    // Obtener todas las imágenes en una sola consulta agrupadas por subScenarioId
    const allImages = await this.imageRepository.findBySubScenarioIds(subScenarioIds);
    
    // Agrupar imágenes por subScenarioId para un acceso más rápido
    const imagesBySubScenarioId = new Map<number, SubScenarioImageDomainEntity[]>();
    
    allImages.forEach(image => {
      if (!imagesBySubScenarioId.has(image.subScenarioId)) {
        imagesBySubScenarioId.set(image.subScenarioId, []);
      }
      imagesBySubScenarioId.get(image.subScenarioId)!.push(image);
    });
    
    // Mapear sub-escenarios con sus imágenes
    const dto = subs.map(sub => {
      if (sub.id === null) {
        return SubScenarioMapper.toDto(sub, scen, area, surf, neigh, []);
      }
      
      const subImages = imagesBySubScenarioId.get(sub.id) || [];
      return SubScenarioMapper.toDto(sub, scen, area, surf, neigh, subImages);
    });
    
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
  ): Promise<SubScenarioWithRelationsDto> {
    const sub: SubScenarioDomainEntity | null = await this.subScenarioRepository.findByIdWithRelations(id);
    if (!sub) throw new NotFoundException(`SubScenario ${id} no encontrado`);
    const [ scenMap, areaMap, surfMap, neighMap ] = await this.loadReferenceMaps([sub]);
    
    // Obtener las imágenes del sub-escenario
    const images = await this.imageRepository.findBySubScenarioId(id);
    return SubScenarioMapper.toDto(sub, scenMap, areaMap, surfMap, neighMap, images);
  }
  
  async create(
    createDto: CreateSubScenarioDto,
    images?: Express.Multer.File[],
  ): Promise<SubScenarioWithRelationsDto> {
    // Verificar que exista el escenario
    const scenario = await this.scenarioRepository.findById(createDto.scenarioId);
    if (!scenario) {
      throw new NotFoundException(`Escenario con ID ${createDto.scenarioId} no encontrado`);
    }
    
    // Crear el sub-escenario
    const subScenarioDomain = SubScenarioDomainEntity.builder()
      .withName(createDto.name)
      .withState(createDto.state || false)
      .withHasCost(createDto.hasCost || false)
      .withnumberOfSpectators(createDto.numberOfSpectators || 0)
      .withNumberOfPlayers(createDto.numberOfPlayers || 0)
      .withRecommendations(createDto.recommendations || '')
      .withScenarioId(createDto.scenarioId)
      .withActivityAreaId(createDto.activityAreaId ?? 0)
      .withFieldSurfaceTypeId(createDto.fieldSurfaceTypeId ?? 0)
      .build();
      
    const savedSubScenario = await this.subScenarioRepository.save(subScenarioDomain);
    
    // Si hay imágenes, subirlas
    if (images && images.length > 0 && savedSubScenario.id) {
      await Promise.all(images.map(async (image, index) => {
        await this.imageRepository.save(
          SubScenarioImageDomainEntity.builder()
            .withPath(`/images/${image.originalname}`)
            .withIsFeature(index === 0) // La primera imagen es la principal
            .withDisplayOrder(index)
            .withSubScenarioId(savedSubScenario.id!)
            .build()
        );
      }));
    }
    
    // Obtener el sub-escenario con sus relaciones
    return this.getByIdWithRelations(savedSubScenario.id!);
  }
  
  async update(
    id: number,
    updateDto: UpdateSubScenarioDto,
  ): Promise<SubScenarioWithRelationsDto> {
    // Verificar que exista el sub-escenario
    const existingSubScenario = await this.subScenarioRepository.findById(id);
    if (!existingSubScenario) {
      throw new NotFoundException(`Sub-escenario con ID ${id} no encontrado`);
    }
    
    // Actualizar el sub-escenario
    const subScenarioDomain = SubScenarioDomainEntity.builder()
      .withId(id)
      .withName(updateDto.name || existingSubScenario.name)
      .withState(updateDto.state !== undefined ? updateDto.state : existingSubScenario.state)
      .withHasCost(updateDto.hasCost !== undefined ? updateDto.hasCost : existingSubScenario.hasCost)
      .withnumberOfSpectators(
        updateDto.numberOfSpectators !== undefined && updateDto.numberOfSpectators !== null
          ? updateDto.numberOfSpectators
          : existingSubScenario.numberOfSpectators ?? 0
      )
      .withNumberOfPlayers(
        updateDto.numberOfPlayers !== undefined && updateDto.numberOfPlayers !== null
          ? updateDto.numberOfPlayers
          : existingSubScenario.numberOfPlayers ?? 0
      )
      .withRecommendations(
        updateDto.recommendations !== undefined && updateDto.recommendations !== null
          ? updateDto.recommendations
          : existingSubScenario.recommendations ?? ''
      )
      .withScenarioId(existingSubScenario.scenarioId)
      .withActivityAreaId(
        updateDto.activityAreaId !== undefined && updateDto.activityAreaId !== null
          ? updateDto.activityAreaId
          : existingSubScenario.activityAreaId ?? 0
      )
      .withFieldSurfaceTypeId(
        updateDto.fieldSurfaceTypeId !== undefined && updateDto.fieldSurfaceTypeId !== null
          ? updateDto.fieldSurfaceTypeId
          : existingSubScenario.fieldSurfaceTypeId ?? 0
      )
      .withCreatedAt(existingSubScenario.createdAt ?? new Date())
      .build();
      
    await this.subScenarioRepository.save(subScenarioDomain);
    
    // Obtener el sub-escenario actualizado con sus relaciones
    return this.getByIdWithRelations(id);
  }
  
  async delete(id: number): Promise<boolean> {
    // Verificar que exista el sub-escenario
    const existingSubScenario = await this.subScenarioRepository.findById(id);
    if (!existingSubScenario) {
      throw new NotFoundException(`Sub-escenario con ID ${id} no encontrado`);
    }
    
    // Eliminar el sub-escenario
    return this.subScenarioRepository.delete(id);
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
