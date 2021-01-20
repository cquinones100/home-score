import express from 'express';
import UserSession from './types/UserSession';

const currentRouter = express.Router();

currentRouter
  .route('/current')
  .get(async (req, res) => {
    console.log('current', req.session)
    if ((req.session as UserSession).user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });


export default currentRouter;
