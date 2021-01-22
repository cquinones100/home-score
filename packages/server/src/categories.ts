import express from 'express';
import Home from '../../../src/types/Home';
import dbConnection from './dbConnection';
import getHomes from './queries/getHomes';

const categoriesRouter = express.Router();

categoriesRouter
  .route('/categories')
  .put(async (req, res) => {
    try {
      const { home_id, user_id, category_id, ...updateValues } =  req.body;
      const category = (await dbConnection('categories_homes')
        .leftJoin(
          'categories',
          'categories_homes.category_id',
          'categories.category_id'
        )
        .where({
          user_id,
          'categories_homes.category_id': category_id,
          home_id
        }))[0]

      const updateResult = await dbConnection('categories_homes')
        .where({
          home_id: Number(home_id),
          category_id: Number(category.category_id)
        })
        .update({ ...updateValues })
        .returning('value')
      
      const home = (await getHomes().where({ home_id }) as Home[])[0];

      res.json({
        value: updateResult[0],
        home
      }).sendStatus(200);
    } catch (e) {
      console.log(e);

      res.sendStatus(422);
    }
  });


export default categoriesRouter;
