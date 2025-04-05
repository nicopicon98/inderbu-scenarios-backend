import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { BaseRepositoryAdapter } from './common/base-repository.adapter';
import { CityEntity } from 'src/infrastructure/persistence/city.entity';
import { CityDomain } from 'src/core/domain/entities/cedi.entity';
import { ICityRepositoryPort } from 'src/core/domain/ports/outbound/city-repository.port';

@Injectable()
export class CityRepositoryAdapter
  extends BaseRepositoryAdapter<CityEntity, CityDomain>
  implements ICityRepositoryPort
{
  constructor(
    @Inject('CITY_REPOSITORY')
    repository: Repository<CityEntity>,
  ) {
    super(repository);
  }

  protected toEntity(cityDomain: CityDomain): CityEntity {
    const a: CityEntity = this.repository.create({
      name: cityDomain['name'],
    });
    return a;
  }

  protected toDomain(cityEntity: CityEntity): CityDomain {
    return CityDomain.builder()
      .withId(cityEntity.id)
      .withName(cityEntity.name)
      .build();
  }
}