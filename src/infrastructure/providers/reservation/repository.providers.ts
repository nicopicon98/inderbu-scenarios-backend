import { ReservationRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/reservation-repository.adapter';
import { ReservationTimeslotRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/reservation-timeslot-repository.adapter';
import { ReservationInstanceRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/reservation-instance-repository.adapter';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

export const repositoryProviders = [
  {
    provide: REPOSITORY_PORTS.RESERVATION,
    useClass: ReservationRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.RESERVATION_TIMESLOT,
    useClass: ReservationTimeslotRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.RESERVATION_INSTANCE,
    useClass: ReservationInstanceRepositoryAdapter,
  },
];
