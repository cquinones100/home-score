import express from 'express';
import dbConnection from './dbConnection';
import getHomes from './queries/getHomes';
import reconcileCategories from './reconcileCategories';
import UserSession from './types/UserSession';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { File } from 'formidable';

type HomeImageUrl = {
  url: string;
}

const homesRouter = express.Router();

homesRouter
  .route('/homes/:id')
  .get(async (req, res) => {
    const user_id = (req.session as UserSession)?.user?.user_id;
    const { id: home_id } = req.params;
    const home = (await dbConnection('homes').where({ home_id }))[0];

    if (!home) return res.sendStatus(404);

    await reconcileCategories(Number(home_id), user_id);

    const categories = (await
      dbConnection('categories_homes')
        .leftJoin('categories', 'categories_homes.category_id', 'categories.category_id')
        .where({ home_id, user_id })
    );

    const homeImageUrls = (await
      dbConnection('home_image_urls')
        .select('home_image_url_id')
        .where({ home_id })
    );

    res.json({
      ...home,
      categories,
      image_urls: homeImageUrls.map(({ home_image_url_id }) => home_image_url_id),
      score: categories.reduce((acc, { value, weight }) => acc += (value * weight), 0) /
        categories.reduce((acc, { weight }) => acc += weight, 0)
    });
  });

homesRouter
  .route('/homes')
  .get(async (req, res) => {
    const user_id = (req.session as UserSession)?.user?.user_id;
    const homes = (await dbConnection('homes'));

    res.json(
      await Promise.all(
        homes.map(async(home) => {
          const categories = (await
            dbConnection('categories_homes')
              .leftJoin('categories', 'categories_homes.category_id', 'categories.category_id')
              .where({ home_id: home.home_id, user_id })
          );

          return({
            ...home,
            score: categories.reduce((acc, { value, weight }) => acc += (value * weight), 0) /
              categories.reduce((acc, { weight }) => acc += weight, 0)
          });
        })
      )
    );
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
  .post('/homes/:id/home_image_urls', async (req, res) => {
    const { id: home_id } = req.params;

    const home = (await dbConnection('homes').where({ home_id }))[0];

    const form = new formidable.IncomingForm();
    form.multiples = true;

    form.parse(req, async (err, fields, { files }) => {
      const homeImagesDir = process.cwd() + `/home_images`; 
      const dir = process.cwd() + `/home_images/${home.address}`; 

      fs.mkdir(homeImagesDir, (err) => { });
      fs.mkdir(dir, (err) => { });

      const saveFile = async (file: File) => {
        const tempFilePath = file.path;

        console.log(tempFilePath);
        const targetPath = path.join(dir + '/' + file.name);

        try {
          fs.renameSync(tempFilePath, targetPath);

          await dbConnection('home_image_urls').insert({
            home_id,
            url: targetPath
          });
        } catch (e) {
          console.log("UPLOAD FAILED")
          console.log(e)
        }
      };

      if (!(files as File[]).length) {
        await saveFile(files as File);
      } else {
        for (let i = 0; i < ((files as File[]).length as unknown as number); i++) {
          await saveFile((files as File[])[i]);
        }
      }

      res.sendStatus(200);
    });
  });

homesRouter
  .get('/homes/:id/home_image_urls/:home_image_url_id', async (req, res) => {
    const { id: home_id, home_image_url_id } = req.params;

    const homeImageUrl: HomeImageUrl = (
      await dbConnection('home_image_urls')
        .where({ home_id, home_image_url_id })
      )[0];

    if (!homeImageUrl) return res.sendStatus(404);

    res.sendFile(homeImageUrl.url);
  });

homesRouter
  .route('/homes/:id')
  .put(async (req, res) => {
  });

export default homesRouter;
