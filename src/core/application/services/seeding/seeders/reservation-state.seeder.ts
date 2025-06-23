import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { DATA_LOADER } from 'src/infrastructure/tokens/data-loader';
import { IDataLoader } from '../interfaces/data-loader.interface';
import { ISeeder } from '../interfaces/seeder.interface';
import { AbstractSeeder } from './abstract.seeder';
import { ReservationStateEntity } from 'src/infrastructure/persistence/reservation-state.entity';
import { IReservationStateSeed } from '../interfaces/reservation-state-seed.interface';

@Injectable()
export class ReservationStateSeeder
  extends AbstractSeeder<ReservationStateEntity, IReservationStateSeed>
  implements ISeeder
{
  constructor(
    @Inject(MYSQL_REPOSITORY.RESERVATION_STATE)
    repository: Repository<ReservationStateEntity>,
    @Inject(DATA_LOADER.JSON)
    protected jsonLoader: IDataLoader,
  ) {
    super(repository);
  }

  protected async alreadySeeded(): Promise<boolean> {
    return (await this.repository.count()) > 0;
  }

  protected async getSeeds(): Promise<IReservationStateSeed[]> {
    return this.jsonLoader.load<IReservationStateSeed>('reservation-state-seeds.json');
  }

  protected async transform(seeds: IReservationStateSeed[]): Promise<ReservationStateEntity[]> {
    return seeds.map(seed =>
      this.repository.create({ state: seed.state })
    );
  }
}
