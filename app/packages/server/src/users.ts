import express from 'express';
import dbConnection from './dbConnection';
import UserSession from './types/UserSession';
import bcrypt from 'bcrypt';

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
    const { name, password } = req.body;

    const user = await dbConnection('users')
      .insert({ name: name.toLowerCase(), password: bcrypt.hashSync(password, 10) })
      .returning(['name', 'password']);

    (req.session as UserSession).user = { name: user[0].name };

    if ((req.session as UserSession).user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  })

usersRouter
  .route('/users/:id')
  .delete(async (req, res) => {
    (req.session as UserSession).user = null;

    res.sendStatus(204);
  });

type UserWithPassword = {
  user_id: number;
  name: string;
  password: string;
};

usersRouter
  .route('/users/login')
  .post(async (req, res) => {
    const { name, password } = req.body;

    const user: UserWithPassword =
      (await dbConnection('users').where({ name }))[0];

    if (bcrypt.compareSync(password, user.password)) {
      (req.session as UserSession).user = {
        user_id: user.user_id,
        name: user.name.toLowerCase()
      };

      res.sendStatus(200)
    } else {
      res.sendStatus(403)
    }
  });

export default usersRouter;
