export const ENV_CONFIG = {
  DATABASE: {
    HOST: 'DB_HOST',
    PORT: 'DB_PORT',
    USER: 'DB_USER',
    PASSWORD: 'DB_PASSWORD',
    NAME: 'DB_NAME',
    SYNCHRONIZE: 'DB_SYNCHRONIZE',
  },
  APP: {
    NODE_ENV: 'NODE_ENV',
    SEED_DB: 'SEED_DB',
  },
} as const;
