import express from 'express';
import dbConnection from './dbConnection';
import getHomes from './queries/getHomes';
import reconcileCategories from './reconcileCategories';
import scrapeImageUrls from './scrapeImageUrls';
import UserSession from './types/UserSession';

type HomeImageUrl = {
  url: string;
}

const homesRouter = express.Router();

homesRouter
  .route('/homes/:id')
  .get(async (req, res) => {
    const user_id = (req.session as UserSession)?.user?.user_id;
    const { id: home_id } = req.params;

    reconcileCategories(Number(home_id), user_id);

    const home = (await getHomes({ user_id }))[0];

    if (!home) return res.sendStatus(404);

    let image_urls = await dbConnection('home_image_urls')
      .select('url')
      .where({ home_id });

    if (image_urls.length === 0) {
      image_urls = await scrapeImageUrls(home.url, home.address);
    }

    res.json({
      ...home,
      image_urls: (image_urls as HomeImageUrl[]).map(({ url }) => url),
    });
  });

homesRouter
  .route('/homes')
  .get(async (req, res) => {
    const user_id = (req.session as UserSession)?.user?.user_id;
    const homes = await getHomes({ user_id })

    res.json(homes);
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
