import dbConnection from "./dbConnection";
import getHomes from "./queries/getHomes";

const reconcileCategories = async (home_id: number, user_id: number) => {
  const home = await getHomes().where({ home_id });
  const user = await dbConnection('users').where({ user_id });

  if (home[0] && user[0]) {
    const missingCategoryIdsQuery = await dbConnection.raw(`
      with current_categories as (
        select categories.category_id, ch.home_id from categories
        full outer join categories_homes ch on categories.category_id = ch.category_id
        where user_id = ?
      ),
      current_categories_homes as (
        select * from categories_homes
        where home_id = ?
      )

      select distinct on (category_id) * from current_categories
      left outer join current_categories_homes using (category_id)
      where current_categories.home_id is null;
    `, [user_id, home_id])

    console.log()

    const missingCategoryIds = missingCategoryIdsQuery
      .rows
      .map(({ category_id }: { category_id: number }) => ({
        category_id, home_id
      }));

    await dbConnection('categories_homes').insert(missingCategoryIds);
  }
};

export default reconcileCategories;
