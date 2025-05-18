import { applicationProviders } from './application.providers';
import { repositoryProviders } from './repository.providers';
import { repositoryEntitiesProviders } from './repository-entities.providers';

export const subScenarioImageProviders = [
  ...applicationProviders,
  ...repositoryProviders,
  ...repositoryEntitiesProviders,
];
