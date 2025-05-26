import { CommuneApplicationService } from 'src/core/application/services/commune-application.service';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';

export const applicationProviders = [
  {
    provide: APPLICATION_PORTS.COMMUNE,
    useClass: CommuneApplicationService,
  },
];
