import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { FieldSurfaceTypeEntity } from 'src/infrastructure/persistence/field-surface-type.entity';
import { IFieldSurfaceTypeSeed } from '../interfaces/field-surface-type-seed.interface';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { ISeeder } from '../interfaces/seeder.interface';
import { AbstractSeeder } from './abstract.seeder';

@Injectable()
export class FieldSurfaceTypeSeeder
  extends AbstractSeeder<FieldSurfaceTypeEntity, IFieldSurfaceTypeSeed>
  implements ISeeder
{
  constructor(
    @Inject('FIELD_SURFACE_TYPE_REPOSITORY')
    repository: Repository<FieldSurfaceTypeEntity>,
    @Inject('IDataLoader')
    protected jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<IFieldSurfaceTypeSeed[]> {
    return this.jsonLoader.load<IFieldSurfaceTypeSeed>(
      'field-surface-type-seeds.json',
    );
  }

  protected async transform(
    seeds: IFieldSurfaceTypeSeed[],
  ): Promise<FieldSurfaceTypeEntity[]> {
    return seeds.map((seed) => this.repository.create({ name: seed.name }));
  }
}
