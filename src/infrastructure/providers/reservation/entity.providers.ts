import { DataSource } from 'typeorm';

import { NeighborhoodEntity } from 'src/infrastructure/persistence/neighborhood.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';
import { ReservationEntity } from 'src/infrastructure/persistence/reservation.entity';
import { TimeSlotEntity } from 'src/infrastructure/persistence/time-slot.entity';
import { ReservationStateEntity } from 'src/infrastructure/persistence/reservation-state.entity';

export const repositoryEntityProviders = [
  {
    provide: MYSQL_REPOSITORY.RESERVATION,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(ReservationEntity);
    },
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.TIME_SLOT,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(TimeSlotEntity);
    },
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.RESERVATION_STATE,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(ReservationStateEntity);
    },
    inject: [DATA_SOURCE.MYSQL],
  },
];
