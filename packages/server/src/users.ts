import express from 'express';
import { dbConnection } from '.';
import UserSession from './types/UserSession';

const usersRouter = express.Router();

usersRouter
  .route('/users')
  .get(async (req, res) => {
    const users = await dbConnection('users');

    res.json(users);
  });

usersRouter
  .route('/users')
  .post(async (req, res) => {
    const { name } = req.body;

    console.log(req.body)

    const user = await dbConnection('users').where({ name });

    (req.session as UserSession).user = user[0];

    if ((req.session as UserSession).user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });


export default usersRouter;
