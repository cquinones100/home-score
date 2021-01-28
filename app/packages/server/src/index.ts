import express, { NextFunction, Request, Response } from 'express';
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

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('*******************');
  console.log(`Request: ${req.path}`);

  try {
    next();
  } catch (e) {
    console.log('Request error:');
    console.log(e);
  }
  console.log('*******************');
};

const app = express();

app.use(loggingMiddleware);

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
