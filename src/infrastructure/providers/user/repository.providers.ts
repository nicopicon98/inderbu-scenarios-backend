import { UserRepositoryAdapter } from 'src/infrastructure/adapters/outbound/repositories/user-repository.adapter';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

export const repositoryProviders = [
  {
    provide: REPOSITORY_PORTS.USER,
    useClass: UserRepositoryAdapter,
  },
];
