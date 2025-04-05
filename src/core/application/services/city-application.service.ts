import { Inject, Injectable } from '@nestjs/common';
import { CityEntity } from 'src/infrastructure/persistence/city.entity';
import { DataSource, Repository } from 'typeorm';
import { ICityApplicationPort } from '../ports/city-application.port';
import { ICityRepositoryPort } from 'src/core/domain/ports/outbound/city-repository.port';

@Injectable()
export class CityApplicationService implements ICityApplicationPort {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly databaseSource: DataSource,
    @Inject('ICityRepositoryPort')
    private readonly cityRepositoryAdapter: ICityRepositoryPort,
  ) {}

  async getAll() {
    const cityRepository: Repository<CityEntity> =
      this.databaseSource.getRepository(CityEntity);
    const allCities = await cityRepository.find();
    return {
      status: 200,
      data: allCities,
    };
  }

  async findById(id: number): Promise<any> {
    return this.cityRepositoryAdapter.findById(id);
  }
}
