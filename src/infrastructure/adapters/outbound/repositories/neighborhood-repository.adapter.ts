import { Injectable, Inject } from '@nestjs/common';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '../../inbound/http/dtos/common/page-options.dto';

import { NeighborhoodEntityMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-entity.mapper';
import { INeighborhoodRepositoryPort } from 'src/core/domain/ports/outbound/neighborhood-repository.port';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { NeighborhoodEntity } from '../../../persistence/neighborhood.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';

@Injectable()
export class NeighborhoodRepositoryAdapter
  extends BaseRepositoryAdapter<NeighborhoodEntity, NeighborhoodDomainEntity>
  implements INeighborhoodRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.NEIGHBORHOOD)
    repo: Repository<NeighborhoodEntity>,
  ) {
    super(repo, ['commune']);
  }

  protected toDomain(entity: NeighborhoodEntity): NeighborhoodDomainEntity {
    return NeighborhoodEntityMapper.toDomain(entity);
  }

  protected toEntity(): NeighborhoodEntity {
    throw new Error('Only read operations supported');
  }

  async findAll(): Promise<NeighborhoodDomainEntity[]> {
    const list = await this.repository.find({ order: { name: 'ASC' } });
    return list.map(NeighborhoodEntityMapper.toDomain);
  }

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.repository.findBy({ id: In(ids) });
    return list.map(NeighborhoodEntityMapper.toDomain);
  }

  async findPaged(opts: PageOptionsDto): Promise<{ data: NeighborhoodDomainEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search
    } = opts;

    const qb: SelectQueryBuilder<NeighborhoodEntity> = this.repository
      .createQueryBuilder('n');

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
          ((n.name LIKE :pref)*1 + (n.name LIKE :any)*0.5)
          `,
          'score',
        ).andWhere(
          `
          n.name LIKE :any
          `,
          { pref: likePref, any: likeAny },
        );

        /* posición de la coincidencia en name */
        qb.addSelect('LOCATE(:loc, n.name)', 'pos')
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
          (MATCH(n.name) AGAINST (:q IN BOOLEAN MODE))
          `,
          'score',
        )
          .andWhere(
            `
            MATCH(n.name) AGAINST (:q IN BOOLEAN MODE)
            `,
            { q: boolean },
          )
          .orderBy('score', 'DESC');
      }
    }

    /* ───── orden secundario + paginación ───── */
    qb.addOrderBy('n.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { data: entities.map(NeighborhoodEntityMapper.toDomain), total };
  }
}
