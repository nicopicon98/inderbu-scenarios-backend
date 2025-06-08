import { applicationProviders } from './application.providers';
import { repositoryProviders } from './repository.providers';
import { repositoryEntityProviders } from './entity.providers';
import { domainServiceProviders } from './domain-services.providers';

export const reservationProviders = [
  ...repositoryEntityProviders,
  ...repositoryProviders,
  ...domainServiceProviders,
  ...applicationProviders,
];
