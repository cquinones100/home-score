import express from 'express';
import knex from 'knex';
import homeWithImageUrls from './getImages';
import knexConfig from './knexfile';
import Home from './types/Home';

export const dbConnection = knex(knexConfig['development']);

const app = express();

app.get('/hello_world', (req, res) => {
  res.json(
    JSON.stringify({ message: 'hello!' })
  )
});

app.get('/homes/:id', async (req, res) => {
  const home = await dbConnection.raw(`
    select
    distinct on (home_id)
      home_id,
      sum(value * weight) / sum(weight * 10) as score,
      url,
      address,
      users.name as user_name,
      image_urls,
      array_agg(
        json_build_object(
          'name', categories.name,
          'weight', categories.weight,
          'score', categories_homes.value
        )
      ) as categories
      from categories_homes
      join categories using(category_id)
      join homes using(home_id)
      join users using(user_id)
      where home_id = ?
      group by url, address, users.name, home_id, image_urls;
  `, [req.params.id])

  res.json(await homeWithImageUrls(home.rows[0]));
});

app.get('/homes', async (req, res) => {
  const homes = await dbConnection.raw(`
    select
      sum(value * weight) / sum(weight * 10) as score,
      url,
      address,
      users.name as user_name,
      homes.home_id,
      image_urls
      from categories_homes
      join categories using(category_id)
      join homes using(home_id)
      join users using(user_id)
      group by url, address, users.name, homes.home_id, image_urls;
  `)

  const result = await Promise.all(
    homes.rows.map(async (home: Home) => await homeWithImageUrls(home))
  );

  res.json(result);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});
