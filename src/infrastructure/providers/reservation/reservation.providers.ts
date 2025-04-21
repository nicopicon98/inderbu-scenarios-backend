import { applicationProviders } from "./application.providers";
import { repositoryEntityProviders } from "./entity.providers";
import { repositoryProviders } from "./repository.providers";

export const reservationProviders = [
    ...repositoryProviders,
    ...applicationProviders,
    ...repositoryEntityProviders
];
