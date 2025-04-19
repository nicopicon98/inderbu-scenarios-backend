import { Injectable, Inject } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { SubScenarioEntityMapper } from 'src/infrastructure/mappers/sub-scenario/sub-scenario-entity.mapper';
import { ISubScenarioRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-repository.port';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { SubScenarioEntity } from 'src/infrastructure/persistence/sub-scenario.entity';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { PageOptionsDto } from '../../inbound/http/dtos/common/page-options.dto';

@Injectable()
export class SubScenarioRepositoryAdapter
  extends BaseRepositoryAdapter<SubScenarioEntity, SubScenarioDomainEntity>
  implements ISubScenarioRepositoryPort
{
  constructor(
    @Inject('SUB_SCENARIO_REPOSITORY')
    repository: Repository<SubScenarioEntity>,
  ) {
    super(repository, ['scenario', 'activityArea', 'fieldSurfaceType']);
  }

  protected toEntity(domain: SubScenarioDomainEntity): SubScenarioEntity {
    return SubScenarioEntityMapper.toEntity(domain);
  }

  protected toDomain(entity: SubScenarioEntity): SubScenarioDomainEntity {
    return SubScenarioEntityMapper.toDomain(entity);
  }

  async findAll(): Promise<SubScenarioDomainEntity[]> {
    const entities = await this.repository.find({
      relations: ['scenario', 'activityArea', 'fieldSurfaceType'],
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findPaged(opts: PageOptionsDto) {
    const { page = 1, limit = 20, search, scenarioId, activityAreaId } = opts;

    const qb = this.repository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.scenario', 'sc')
      .leftJoinAndSelect('s.activityArea', 'aa')
      .leftJoinAndSelect('s.fieldSurfaceType', 'fs');

    /* filtros */
    if (scenarioId) qb.andWhere('sc.id = :scenarioId', { scenarioId });
    if (activityAreaId)
      qb.andWhere('aa.id = :activityAreaId', { activityAreaId });

    /* búsqueda */
    if (search?.trim()) {
      qb.addSelect(
        `
        (
          (MATCH(s.name) AGAINST (:q IN NATURAL LANGUAGE MODE))*1     +
          (MATCH(sc.name) AGAINST (:q IN NATURAL LANGUAGE MODE))*0.75 +
          (MATCH(aa.name) AGAINST (:q IN NATURAL LANGUAGE MODE))*0.50 +
          (MATCH(fs.name) AGAINST (:q IN NATURAL LANGUAGE MODE))*0.25
        )`,
        'score',
      )
        .andWhere(
          `
          MATCH(s.name)  AGAINST (:q IN NATURAL LANGUAGE MODE)
          OR MATCH(sc.name)  AGAINST (:q IN NATURAL LANGUAGE MODE)
          OR MATCH(aa.name)  AGAINST (:q IN NATURAL LANGUAGE MODE)
          OR MATCH(fs.name)  AGAINST (:q IN NATURAL LANGUAGE MODE)
        `,
          { q: search },
        )
        .orderBy('score', 'DESC');
    }

    /* orden secundario + paginación */
    qb.addOrderBy('s.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { data: entities.map(SubScenarioEntityMapper.toDomain), total };
  }
}
