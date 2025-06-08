import { DataSource } from 'typeorm';

import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { ReservationEntity } from 'src/infrastructure/persistence/reservation.entity';
import { ReservationTimeslotEntity } from 'src/infrastructure/persistence/reservation-timeslot.entity';
import { ReservationInstanceEntity } from 'src/infrastructure/persistence/reservation-instance.entity';
import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';

export const repositoryEntityProviders = [
  {
    provide: MYSQL_REPOSITORY.RESERVATION,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ReservationEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.RESERVATION_TIMESLOT,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ReservationTimeslotEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
  {
    provide: MYSQL_REPOSITORY.RESERVATION_INSTANCE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ReservationInstanceEntity),
    inject: [DATA_SOURCE.MYSQL],
  },
];
