import { Injectable, Inject } from '@nestjs/common';
import { Repository, In } from 'typeorm';

import { IScenarioRepositoryPort } from 'src/core/domain/ports/outbound/scenario-repository.port';
import { ScenarioEntityMapper } from 'src/infrastructure/mappers/scenario/scenario-entity.mapper';
import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';
import { ScenarioEntity } from 'src/infrastructure/persistence/scenario.entity';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';

@Injectable()
export class ScenarioRepositoryAdapter
  extends BaseRepositoryAdapter<ScenarioEntity, ScenarioDomainEntity>
  implements IScenarioRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.SCENARIO)
    repo: Repository<ScenarioEntity>,
  ) {
    super(repo);
  }

  protected toDomain(e: ScenarioEntity): ScenarioDomainEntity {
    return ScenarioEntityMapper.toDomain(e);
  }
  protected toEntity(d: ScenarioDomainEntity): ScenarioEntity {
    return ScenarioEntityMapper.toEntity(d);
  }

  async findByIds(ids: number[]): Promise<ScenarioDomainEntity[]> {
    const entities = await this.repository.find({
      where: { id: In(ids) },
      relations: ['neighborhood'],
    });
    return entities.map(e => this.toDomain(e));
  }
}
