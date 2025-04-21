import { ReservationApplicationService } from "src/core/application/services/reservation-application.service";
import { APPLICATION_PORTS } from "src/core/application/tokens/ports";

export const applicationProviders = [
  {
    provide: APPLICATION_PORTS.RESERVATION,
    useClass: ReservationApplicationService,
  },
];
