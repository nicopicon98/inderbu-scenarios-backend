import { Provider } from '@nestjs/common';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';
import { SubScenarioImageRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/sub-scenario-image-repository.adapter';

export const repositoryProviders: Provider[] = [
  {
    provide: REPOSITORY_PORTS.SUB_SCENARIO_IMAGE,
    useClass: SubScenarioImageRepositoryAdapter,
  },
];
