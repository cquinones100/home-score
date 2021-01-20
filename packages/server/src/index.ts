import express from 'express';
import knex from 'knex';
import knexConfig from './knexfile';
import cors from 'cors';
import homesRouter from './homes';
import bodyParser from 'body-parser';

var corsOptions = {
  origin: 'http://localhost:3002',
  optionsSuccessStatus: 200
}

export const dbConnection = knex(knexConfig['development']);

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(homesRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});
