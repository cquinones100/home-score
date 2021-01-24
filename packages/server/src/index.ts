import express from 'express';
import cors from 'cors';
import homesRouter from './homes';
import bodyParser from 'body-parser';
import session from 'express-session';
import usersRouter from './users';
import currentRouter from './current';
import categoriesRouter from './categories';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

var corsOptions = {
  origin: `${process.env.CLIENT_ROOT}`,
  optionsSuccessStatus: 200,
  credentials: true
}

console.log(process.env.CLIENT_ROOT);

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
}));

app.use(homesRouter);
app.use(usersRouter);
app.use(currentRouter);
app.use(categoriesRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});
