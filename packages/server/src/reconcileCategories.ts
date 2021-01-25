import dbConnection from "./dbConnection";
import getHomes from "./queries/getHomes";

const reconcileCategories = async (home_id: number, user_id: number) => {
  const home = await dbConnection('homes').where({ home_id });
  const user = await dbConnection('users').where({ user_id });

  if (home[0] && user[0]) {
    const missingCategoryIdsQuery = await dbConnection.raw(`
      select category_id, curr_cats.home_id
        from categories
        left outer join
        (select category_id, home_id from categories_homes where home_id = ?) as curr_cats using (category_id)
        where curr_cats.home_id is null
    `, [home_id])

    const missingCategoryIds = missingCategoryIdsQuery
      .rows
      .map(({ category_id }: { category_id: number }) => ({
        category_id, home_id
      }));

    await dbConnection('categories_homes').insert(missingCategoryIds);
  }
};

export default reconcileCategories;
