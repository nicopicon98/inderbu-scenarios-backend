import { Provider } from '@nestjs/common';
import { SubScenarioImageApplicationService } from 'src/core/application/services/sub-scenario-image-application.service';

export const applicationProviders: Provider[] = [
  {
    provide: 'ISubScenarioImageApplicationPort',
    useClass: SubScenarioImageApplicationService,
  },
];
