import { Injectable, Inject } from '@nestjs/common';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '../../inbound/http/dtos/common/page-options.dto';

import { CommuneEntityMapper } from 'src/infrastructure/mappers/commune/commune-entity.mapper';
import { ICommuneRepositoryPort } from 'src/core/domain/ports/outbound/commune-repository.port';
import { CommuneDomainEntity } from 'src/core/domain/entities/commune.domain-entity';
import { CommuneEntity } from '../../../persistence/commune.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';

@Injectable()
export class CommuneRepositoryAdapter
  extends BaseRepositoryAdapter<CommuneEntity, CommuneDomainEntity>
  implements ICommuneRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.COMMUNE)
    communeRepository: Repository<CommuneEntity>,
  ) {
    super(communeRepository, ['city']);
  }

  protected toDomain(entity: CommuneEntity): CommuneDomainEntity {
    return CommuneEntityMapper.toDomain(entity);
  }

  protected toEntity(domain: CommuneDomainEntity): CommuneEntity {
    return CommuneEntityMapper.toEntity(domain);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<CommuneDomainEntity[]> {
    const list = await this.repository.find({ 
      relations: ['city'],
      order: { name: 'ASC' } 
    });
    return list.map(CommuneEntityMapper.toDomain);
  }

  async findByIds(ids: number[]): Promise<CommuneDomainEntity[]> {
    if (!ids.length) return [];
    const list = await this.repository.find({
      where: { id: In(ids) },
      relations: ['city'] // Cargar relaciones
    });
    return list.map(CommuneEntityMapper.toDomain);
  }

  async findPaged(opts: PageOptionsDto): Promise<{ data: CommuneDomainEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search
    } = opts;

    const qb: SelectQueryBuilder<CommuneEntity> = this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.city', 'city'); // JOIN con city

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
          ((c.name LIKE :pref)*1 + (c.name LIKE :any)*0.5)
          `,
          'score',
        ).andWhere(
          `
          c.name LIKE :any
          `,
          { pref: likePref, any: likeAny },
        );

        /* posición de la coincidencia en name */
        qb.addSelect('LOCATE(:loc, c.name)', 'pos')
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
          (MATCH(c.name) AGAINST (:q IN BOOLEAN MODE))
          `,
          'score',
        )
          .andWhere(
            `
            MATCH(c.name) AGAINST (:q IN BOOLEAN MODE)
            `,
            { q: boolean },
          )
          .orderBy('score', 'DESC');
      }
    }

    /* ───── orden secundario + paginación ───── */
    qb.addOrderBy('c.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { data: entities.map(CommuneEntityMapper.toDomain), total };
  }
}
