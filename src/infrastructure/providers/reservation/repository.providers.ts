import { ReservationRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/reservation-repository.adapter';
import { TimeSlotRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/time-slot-repository.adapter';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';
import { ReservationStateRepositoryAdapter } from '../../adapters/outbound/repositories/reservation-state.repository.adapter';

export const repositoryProviders = [
  {
    provide: REPOSITORY_PORTS.RESERVATION,
    useClass: ReservationRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.TIME_SLOT,
    useClass: TimeSlotRepositoryAdapter,
  },
  {
    provide: REPOSITORY_PORTS.RESERVATION_STATE,
    useClass: ReservationStateRepositoryAdapter,
  },
];
