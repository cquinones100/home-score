import express from 'express';
import Home from '../../../src/types/Home';
import HomeWithImageUrls from '../../../src/types/HomeWithImageUrls';
import dbConnection from './dbConnection';
import homeWithImageUrls from './getImages';
import getHomes from './queries/getHomes';
import UserSession from './types/UserSession';

const homesRouter = express.Router();

homesRouter
  .route('/homes/:id')
  .get(async (req, res) => {
    const user_id = (req.session as UserSession).user.user_id;

    const homeCategories = await dbConnection.raw(`
      select *
      from categories
      join users using (user_id)
      join categories_homes using (category_id)
      where user_id = ? and home_id = ?
    `, [user_id, req.params.id])

    const home = await getHomes({ user_id })
      .where({ home_id: req.params.id }) as Home[];

    if (homeCategories.rows.length !== home[0].categories) {
      console.log('FAILLL')
    };

    res.json(await homeWithImageUrls(home[0]));
  });

homesRouter
  .route('/homes')
  .get(async (req, res) => {
    const homes = await getHomes();

    const result: HomeWithImageUrls[] = await Promise.all(
      homes.map(async (home: Home) => await homeWithImageUrls(home))
    );

    res.json(result);
  })
  .post(async (req, res) => {
    const { url, address } = req.body;

    try {
      await dbConnection('homes').insert({
        url,
        address
      })

      res.sendStatus(201);
    } catch(e) {
      console.log(e);

      res.sendStatus(422);
    }
  });

homesRouter
  .route('/homes/:id')
  .put(async (req, res) => {
  });

export default homesRouter;
