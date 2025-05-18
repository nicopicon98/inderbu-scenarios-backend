import { NamedRefDto, NamedRefWithNeighborhoodDto, SubScenarioWithRelationsDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/sub-scenario-response-with-relations.dto';
import { FieldSurfaceTypeDomainEntity } from 'src/core/domain/entities/field-surface-type.domain-entity';
import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';
import { SubScenarioImageDomainEntity } from 'src/core/domain/entities/sub-scenario-image.domain-entity';
import { SubScenarioImageResponseMapper } from 'src/infrastructure/mappers/images/image-response.mapper';

export class SubScenarioMapper {
  static toDto(
    s: SubScenarioDomainEntity,
    scenMap: Map<number, ScenarioDomainEntity>,
    areaMap: Map<number, ActivityAreaDomainEntity>,
    surfMap: Map<number, FieldSurfaceTypeDomainEntity>,
    neighMap: Map<number, NeighborhoodDomainEntity>,
    images: SubScenarioImageDomainEntity[] = [],
  ): SubScenarioWithRelationsDto {
    return {
      id: s.id!,
      name: s.name,
      state: s.state,
      hasCost: s.hasCost,
      numberOfSpectators: s.numberOfSpectators,
      numberOfPlayers: s.numberOfPlayers,
      recommendations: s.recommendations,
      createdAt: s.createdAt,
      scenarioId: s.scenarioId,
      activityAreaId: s.activityAreaId,
      fieldSurfaceTypeId: s.fieldSurfaceTypeId,

      // escenario + barrio anidado
      scenario: mapScenarioWithNeighborhood(s.scenarioId, scenMap, neighMap),

      activityArea: s.activityAreaId
        ? mapNamedRef(s.activityAreaId, areaMap)
        : undefined,

      fieldSurfaceType: s.fieldSurfaceTypeId
        ? mapNamedRef(s.fieldSurfaceTypeId, surfMap)
        : undefined,
        
      // Incluir imágenes si existen
      images: images.length > 0 
        ? images.map(SubScenarioImageResponseMapper.toDto)
        : undefined,
    };
  }
}

/** Mapea scenario + neighborhood usando tu DomainEntity */
export function mapScenarioWithNeighborhood<
  S extends {
    id: number | null;
    name: string;
    address: string;
    neighborhoodId?: number | null;
  },
>(
  id: number,
  scenMap: Map<number, S>,
  neighMap: Map<number, NeighborhoodDomainEntity>, // <- aquí
) {
  const sc = scenMap.get(id);
  // base del scenario
  const base =
    sc && sc.id !== null
      ? { id: sc.id, name: sc.name, address: sc.address }
      : { id, name: '', address: '' };

  // extrae y mapea el barrio
  const nId = sc?.neighborhoodId;
  const n = nId != null ? neighMap.get(nId) : undefined;

  const neighborhood =
    n && n.id != null
      ? { id: n.id, name: n.name }
      : nId != null
        ? { id: nId, name: '' }
        : { id: 0, name: '' };

  return { ...base, neighborhood };
}

/* -------- tus utilitarias existentes -------- */
export function uniq(ids: (number | null | undefined)[]) {
  return [...new Set(ids.filter((x): x is number => typeof x === 'number'))];
}

export function toMap<T extends { id: number | null }>(list: T[]) {
  return new Map(
    list
      .filter((e): e is T & { id: number } => e.id !== null)
      .map((e) => [e.id, e]),
  );
}

export function mapNamedRef<T extends { id: number | null; name: string }>(
  id: number | undefined,
  map: Map<number, T>,
) {
  const e = id != null ? map.get(id) : undefined;
  return e && e.id !== null
    ? { id: e.id, name: e.name }
    : id != null
      ? { id, name: '' }
      : undefined;
}

export function mapNamedRefWithAddress<
  T extends { id: number | null; name: string; address: string },
>(id: number, map: Map<number, T>) {
  const e = map.get(id);
  return e && e.id !== null
    ? { id: e.id, name: e.name, address: e.address }
    : { id, name: '', address: '' };
}
