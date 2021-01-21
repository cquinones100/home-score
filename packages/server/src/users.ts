import express from 'express';
import dbConnection from './dbConnection';
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

    const user = await dbConnection('users').where({ name });

    (req.session as UserSession).user = user[0];

    if ((req.session as UserSession).user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

usersRouter
  .route('/users/:id')
  .put(async (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
  });

export default usersRouter;
