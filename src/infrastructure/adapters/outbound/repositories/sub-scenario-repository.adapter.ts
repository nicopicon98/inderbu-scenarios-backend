import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { SubScenarioEntityMapper } from 'src/infrastructure/mappers/sub-scenario/sub-scenario-entity.mapper';
import { ISubScenarioRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-repository.port';
import { SubScenarioDomainEntity } from 'src/core/domain/entities/sub-scenario.domain-entity';
import { SubScenarioEntity } from 'src/infrastructure/persistence/sub-scenario.entity';
import { SubScenarioPageOptionsDto } from '../../inbound/http/dtos/sub-scenarios/sub-scenario-page-options.dto';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';

@Injectable()
export class SubScenarioRepositoryAdapter
  extends BaseRepositoryAdapter<SubScenarioEntity, SubScenarioDomainEntity>
  implements ISubScenarioRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.SUB_SCENARIO)
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
  
  async findById(id: number): Promise<SubScenarioDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? this.toDomain(entity) : null;
  }
  
  async save(domainEntity: SubScenarioDomainEntity): Promise<SubScenarioDomainEntity> {
    const entity = this.toEntity(domainEntity);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async findByIdWithRelations(id: number): Promise<SubScenarioDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['scenario', 'scenario.neighborhood', 'activityArea', 'fieldSurfaceType'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  /** Lista paginada + búsqueda ponderada */
  async findPaged(opts: SubScenarioPageOptionsDto) {
    const {
      page = 1,
      limit = 20,
      search,
      scenarioId,
      activityAreaId,
      neighborhoodId,
      hasCost,
    } = opts;

    const qb: SelectQueryBuilder<SubScenarioEntity> = this.repository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.scenario', 'sc')
      .leftJoinAndSelect('sc.neighborhood', 'n')
      .leftJoinAndSelect('s.activityArea', 'aa')
      .leftJoinAndSelect('s.fieldSurfaceType', 'fs');

    /* ───── filtros ───── */
    if (scenarioId) qb.andWhere('sc.id = :scenarioId', { scenarioId });
    if (activityAreaId)
      qb.andWhere('aa.id = :activityAreaId', { activityAreaId });
    if (neighborhoodId)
      qb.andWhere('n.id  = :neighborhoodId', { neighborhoodId });
    if (typeof hasCost === 'boolean')
      qb.andWhere('s.hasCost = :hasCost', { hasCost });

    /* ───── búsqueda ───── */
    if (search?.trim()) {
      const term = search.trim();
      const isTiny = term.length < 4;

      if (isTiny) {
        /* LIKE prefijo + contiene */
        const likeAny = `%${term}%`;
        const likePref = `${term}%`;

        qb.addSelect(
          `
        (
          (s.name  LIKE :pref)*1     + (s.name  LIKE :any)*0.5 +
          (sc.name LIKE :pref)*0.75 + (sc.name LIKE :any)*0.375 +
          (aa.name LIKE :pref)*0.50 + (aa.name LIKE :any)*0.25 +
          (fs.name LIKE :pref)*0.25 + (fs.name LIKE :any)*0.125
        )`,
          'score',
        ).andWhere(
          `
          s.name  LIKE :any OR sc.name LIKE :any
       OR aa.name LIKE :any OR fs.name LIKE :any
      `,
          { pref: likePref, any: likeAny },
        );

        /* posición de la coincidencia en s.name */
        qb.addSelect('LOCATE(:loc, s.name)', 'pos')
          .setParameter('loc', term)
          .orderBy('score', 'DESC')
          .addOrderBy('pos', 'ASC');
      } else {
        /* FULLTEXT BOOLEAN MODE con wildcard * */
        const boolean = term
          .split(/\s+/)
          .map((w) => `+${w}*`)
          .join(' ');

        qb.addSelect(
          `
        (
          (MATCH(s.name)  AGAINST (:q IN BOOLEAN MODE))*1     +
          (MATCH(sc.name) AGAINST (:q IN BOOLEAN MODE))*0.75 +
          (MATCH(aa.name) AGAINST (:q IN BOOLEAN MODE))*0.50 +
          (MATCH(fs.name) AGAINST (:q IN BOOLEAN MODE))*0.25
        )`,
          'score',
        )
          .andWhere(
            `
          MATCH(s.name)  AGAINST (:q IN BOOLEAN MODE) OR
          MATCH(sc.name) AGAINST (:q IN BOOLEAN MODE) OR
          MATCH(aa.name) AGAINST (:q IN BOOLEAN MODE) OR
          MATCH(fs.name) AGAINST (:q IN BOOLEAN MODE)
      `,
            { q: boolean },
          )
          .orderBy('score', 'DESC');
      }
    }

    /* ───── orden secundario + paginación ───── */
    qb.addOrderBy('s.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    console.log({entities});
    return { data: entities.map(SubScenarioEntityMapper.toDomain), total };
  }
}
