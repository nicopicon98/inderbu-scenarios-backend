import { applicationProviders } from './application.providers';
import { repositoryProviders } from './repository.providers';
import { repositoryEntityProviders } from './entity.providers';

export const communeProviders = [
  ...repositoryEntityProviders,
  ...repositoryProviders,
  ...applicationProviders,
];
