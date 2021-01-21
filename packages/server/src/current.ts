import express from 'express';
import UserSession from './types/UserSession';

const currentRouter = express.Router();

currentRouter
  .route('/current')
  .get(async (req, res) => {
    const user = (req.session as UserSession).user;

    if (user) {
      res.json({ user }).sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });


export default currentRouter;
