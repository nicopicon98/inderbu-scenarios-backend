import { Inject, Injectable } from '@nestjs/common';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '../../inbound/http/dtos/common/page-options.dto';

import { ActivityAreaEntityMapper } from 'src/infrastructure/mappers/activity-area/activity-area-entity.mapper';
import { IActivityAreaRepositoryPort } from 'src/core/domain/ports/outbound/activity-area-repository.port';
import { ActivityAreaDomainEntity } from 'src/core/domain/entities/activity-area.domain-entity';
import { ActivityAreaEntity } from 'src/infrastructure/persistence/activity-area.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';

@Injectable()
export class ActivityAreaRepositoryAdapter
  implements IActivityAreaRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.ACTIVITY_AREA)
    private readonly repository: Repository<ActivityAreaEntity>,
  ) {}

  async findById(id: number) {
    const e = await this.repository.findOne({ where: { id } });
    return e ? ActivityAreaEntityMapper.toDomain(e) : null;
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.repository.findBy({ id: In(ids) });
    return list.map(ActivityAreaEntityMapper.toDomain);
  }

  async save(d: ActivityAreaDomainEntity): Promise<ActivityAreaDomainEntity> {
    const entity = ActivityAreaEntityMapper.toEntity(d);
    const savedEntity = await this.repository.save(entity);
    return ActivityAreaEntityMapper.toDomain(savedEntity);
  }

  async findAll(): Promise<ActivityAreaDomainEntity[]> {
    const list = await this.repository.find({ order: { name: 'ASC' } });
    return list.map(ActivityAreaEntityMapper.toDomain);
  }

  async findPaged(opts: PageOptionsDto): Promise<{ data: ActivityAreaDomainEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search
    } = opts;

    const qb: SelectQueryBuilder<ActivityAreaEntity> = this.repository
      .createQueryBuilder('aa');

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
          ((aa.name LIKE :pref)*1 + (aa.name LIKE :any)*0.5)
          `,
          'score',
        ).andWhere(
          `
          aa.name LIKE :any
          `,
          { pref: likePref, any: likeAny },
        );

        /* posición de la coincidencia en name */
        qb.addSelect('LOCATE(:loc, aa.name)', 'pos')
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
          (MATCH(aa.name) AGAINST (:q IN BOOLEAN MODE))
          `,
          'score',
        )
          .andWhere(
            `
            MATCH(aa.name) AGAINST (:q IN BOOLEAN MODE)
            `,
            { q: boolean },
          )
          .orderBy('score', 'DESC');
      }
    }

    /* ───── orden secundario + paginación ───── */
    qb.addOrderBy('aa.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { data: entities.map(ActivityAreaEntityMapper.toDomain), total };
  }

  // ⭐ MÉTODO DELETE IMPLEMENTADO
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }
}
