import { ReservationDateCalculatorDomainService } from 'src/core/domain/services/reservation-date-calculator.domain-service';
import { ReservationConflictDetectorDomainService } from 'src/core/domain/services/reservation-conflict-detector.domain-service';
import { ReservationInstanceGeneratorDomainService } from 'src/core/domain/services/reservation-instance-generator.domain-service';
import { ReservationAvailabilityCheckerDomainService } from 'src/core/domain/services/reservation-availability-checker.domain-service';
import { DOMAIN_SERVICES } from 'src/core/application/tokens/ports';

export const domainServiceProviders = [
  {
    provide: DOMAIN_SERVICES.RESERVATION_DATE_CALCULATOR,
    useClass: ReservationDateCalculatorDomainService,
  },
  {
    provide: DOMAIN_SERVICES.RESERVATION_CONFLICT_DETECTOR,
    useClass: ReservationConflictDetectorDomainService,
  },
  {
    provide: DOMAIN_SERVICES.RESERVATION_INSTANCE_GENERATOR,
    useClass: ReservationInstanceGeneratorDomainService,
  },
  {
    provide: DOMAIN_SERVICES.RESERVATION_AVAILABILITY_CHECKER,
    useClass: ReservationAvailabilityCheckerDomainService,
  },
];
