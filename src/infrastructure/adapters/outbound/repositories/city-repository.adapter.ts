import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { CityEntity } from 'src/infrastructure/persistence/city.entity';
import { ICityRepositoryPort } from 'src/core/domain/ports/outbound/city-repository.port';
import { CityDomainEntity } from 'src/core/domain/entities/city.domain-entity';

@Injectable()
export class CityRepositoryAdapter
  extends BaseRepositoryAdapter<CityEntity, CityDomainEntity>
  implements ICityRepositoryPort
{
  constructor(
    @Inject('CITY_REPOSITORY')
    repository: Repository<CityEntity>,
  ) {
    super(repository);
  }

  protected toEntity(cityDomain: CityDomainEntity): CityEntity {
    const a: CityEntity = this.repository.create({
      name: cityDomain['name'],
    });
    return a;
  }

  protected toDomain(cityEntity: CityEntity): CityDomainEntity {
    return CityDomainEntity.builder()
      .withId(cityEntity.id)
      .withName(cityEntity.name)
      .build();
  }
}