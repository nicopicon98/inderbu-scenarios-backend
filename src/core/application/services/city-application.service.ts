import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ICityRepositoryPort } from 'src/core/domain/ports/outbound/city-repository.port';
import { ICityApplicationPort } from '../ports/inbound/city-application.port';
import { CityEntity } from 'src/infrastructure/persistence/city.entity';
import { MYSQL_DATA_SOURCE } from 'src/infrastructure/providers/database/database.providers';

@Injectable()
export class CityApplicationService implements ICityApplicationPort {
  constructor(
    @Inject(MYSQL_DATA_SOURCE)
    private readonly databaseSource: DataSource,
    @Inject('ICityRepositoryPort')
    private readonly cityRepositoryAdapter: ICityRepositoryPort,
  ) {}

  async getAll() {
    const cityRepository: Repository<CityEntity> =
      this.databaseSource.getRepository(CityEntity);
    return await cityRepository.find();
  }

  async findById(id: number): Promise<any> {
    return this.cityRepositoryAdapter.findById(id);
  }
}
