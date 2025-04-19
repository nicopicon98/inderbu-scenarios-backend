import { Injectable, Inject } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { IScenarioRepositoryPort } from 'src/core/domain/ports/outbound/scenario-repository.port';
import { ScenarioEntityMapper } from 'src/infrastructure/mappers/scenario/scenario-entity.mapper';
import { ScenarioEntity } from 'src/infrastructure/persistence/scenario.entity';
import { ScenarioDomainEntity } from 'src/core/domain/entities/scenario.domain-entity';

@Injectable()
export class ScenarioRepositoryAdapter
  extends BaseRepositoryAdapter<ScenarioEntity, ScenarioDomainEntity>
  implements IScenarioRepositoryPort
{
  constructor(
    @Inject('SCENARIO_REPOSITORY')
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

  async findByIds(ids: number[]) {
    if (!ids.length) return [];
    const list = await this.repository.find({ where: { id: In(ids) } });
    return list.map(this.toDomain);
  }
}