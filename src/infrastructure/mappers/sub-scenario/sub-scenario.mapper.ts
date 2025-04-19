import { SubScenarioWithRelationsDto } from 'src/infrastructure/adapters/inbound/http/dtos/sub-scenarios/sub-scenario-response-with-relations.dto';
import { FieldSurfaceTypeDomainEntity } from 'src/core/domain/entities/field-surface-type.domain-entity';
import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';

export class SubScenarioMapper {
  static toDto(
    s: SubScenarioDomainEntity,
    scenMap: Map<number, ScenarioDomainEntity>,
    areaMap: Map<number, ActivityAreaDomainEntity>,
    surfMap: Map<number, FieldSurfaceTypeDomainEntity>,
  ): SubScenarioWithRelationsDto {
    return {
      id: s.id!,
      name: s.name,
      hasCost: s.hasCost,
      numberOfSpectators: s.numberOfSpectators,
      numberOfPlayers: s.numberOfPlayers,
      recommendations: s.recommendations,

      scenario: mapNamedRefWithAddress(s.scenarioId, scenMap),

      activityArea: s.activityAreaId
        ? mapNamedRef(s.activityAreaId, areaMap)
        : undefined,

      fieldSurfaceType: s.fieldSurfaceTypeId
        ? mapNamedRef(s.fieldSurfaceTypeId, surfMap)
        : undefined,
    };
  }
}

/* ---------- utilidades reutilizables ---------- */
/* ---------- utilidades reutilizables ---------- */
export function uniq(ids: (number | null | undefined)[]) {
  return [...new Set(ids.filter((x): x is number => typeof x === 'number'))];
}

export function toMap<T extends { id: number | null }>(list: T[]) {
  return new Map(
    list
      .filter((e): e is T & { id: number } => e.id !== null) // descarta sin PK
      .map((e) => [e.id, e]),
  );
}

export function mapNamedRef<T extends { id: number | null; name: string }>(
  id: number | undefined,
  map: Map<number, T>,
) {
  const e = id ? map.get(id) : undefined;
  return e && e.id !== null ? { id: e.id, name: e.name } : id ? { id, name: '' } : undefined;
}

export function mapNamedRefWithAddress<
  T extends { id: number | null; name: string; address: string },
>(id: number, map: Map<number, T>) {
  const e = map.get(id);
  return e && e.id !== null
    ? { id: e.id, name: e.name, address: e.address }
    : { id, name: '', address: '' };
}
