// Update with your config settings.

const knexConfig = {
  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    migrations: {
      extension: 'ts',
      directory: 'db/migrations'
    }
  },
};

export default knexConfig;
