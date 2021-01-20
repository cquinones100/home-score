import express from 'express';
import knex from 'knex';
import knexConfig from './knexfile';
import cors from 'cors';
import homesRouter from './homes';
import bodyParser from 'body-parser';
import session from 'express-session';
import usersRouter from './users';
import currentRouter from './current';

var corsOptions = {
  origin: 'http://localhost:3002',
  optionsSuccessStatus: 200,
  credentials: true
}

export const dbConnection = knex(knexConfig['development']);

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(homesRouter);
app.use(usersRouter);
app.use(currentRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});
