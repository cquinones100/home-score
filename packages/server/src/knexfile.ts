// Update with your config settings.

const knexConfig = {
  development: {
    client: "postgresql",
    connection: {
      host: '127.0.0.1',
      database: 'home-score',
      user: 'postgres',
    },
    migrations: {
      extension: 'ts',
      directory: 'db/migrations'
    }
  },
};

export default knexConfig;
