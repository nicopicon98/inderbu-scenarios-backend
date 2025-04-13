import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AbstractSeeder } from './abstract.seeder';
import { ISeeder } from '../interfaces/seeder.interface';
import { IRoleSeed } from '../interfaces/role-seed.interface';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { RoleEntity } from 'src/infrastructure/persistence/role.entity';

@Injectable()
export class RoleSeeder
  extends AbstractSeeder<RoleEntity, IRoleSeed>
  implements ISeeder
{
  constructor(
    @Inject('ROLE_REPOSITORY')
    repository: Repository<RoleEntity>,
    @Inject('IDataLoader')
    protected readonly jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<IRoleSeed[]> {
    return this.jsonLoader.load<IRoleSeed>('role-seeds.json');
  }

  protected async transform(seeds: IRoleSeed[]): Promise<RoleEntity[]> {
    return seeds.map(seed => this.repository.create(seed));
  }
}
