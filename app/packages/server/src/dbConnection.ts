import knex from 'knex';
import knexConfig from './knexfile';

const dbConnection = knex(knexConfig['development']);

export default dbConnection;
