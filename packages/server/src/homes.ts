import express from 'express';
import Home from '../../../src/types/Home';
import HomeWithImageUrls from '../../../src/types/HomeWithImageUrls';
import dbConnection from './dbConnection';
import homeWithImageUrls from './getImages';
import UserSession from './types/UserSession';

const homesRouter = express.Router();

homesRouter
  .route('/homes/:id')
  .get(async (req, res) => {
    const homeCategories = await dbConnection.raw(`
      select *
      from categories
      join users using (user_id)
      join categories_homes using (category_id)
      where user_id = ? and home_id = ?
    `, [(req.session as UserSession).user.user_id, req.params.id])

    const home = await dbConnection.raw(`
      select
        distinct on (home_id)
        home_id,
        sum(value * weight) / sum(weight * 10) as score,
        url,
        address,
        users.name as user_name,
        image_urls,
        avg(value) as score,
        case
        when count(categories_homes.*) = 0
        then
          '{}'
        else
          array_agg(
            json_build_object(
              'name', categories.name,
              'weight', categories.weight,
              'score', categories_homes.value
            )
          )
        end as categories
      from homes
        left join categories_homes using(home_id)
        left join categories using(category_id)
        left join users using(user_id)
      where home_id = ?
      group by url, address, users.name, home_id, image_urls;
    `, [req.params.id])

    if (homeCategories.rows.length !== home.rows[0].categories) {
      console.log('FAILLL')
    };

    res.json(await homeWithImageUrls(home.rows[0]));
  });

homesRouter
  .route('/homes')
  .get(async (req, res) => {
    const homes = await dbConnection.raw(`
      select
        url,
        address,
        home_id,
        image_urls,
        array_agg(
          jsonb_build_object(
            'user_name', user_name,
            'score', score
          )
        ) as scores,
        avg(score) as score
      from (
        select
          url,
          address,
          homes.home_id,
          image_urls,
          users.name as user_name,
          sum(value * weight) / sum(weight * 10) as score
        from homes
               left join categories_homes using(home_id)
               left join categories using(category_id)
               left join users using(user_id)
        group by url, address, users.name, homes.home_id, image_urls, url
      ) as inner_query
      group by url, address, home_id, image_urls;
    `);

    const result: HomeWithImageUrls[] = await Promise.all(
      homes.rows.map(async (home: Home) => await homeWithImageUrls(home))
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

export default homesRouter;
