import dbConnection from "./dbConnection";
import getHomes from "./queries/getHomes";

const reconcileCategories = async (home_id: number, user_id: number) => {
  const home = await getHomes().where({ home_id });
  const user = await dbConnection('users').where({ user_id });

  if (home[0] && user[0]) {
    const missingCategoryIdsQuery = await dbConnection.raw(`
      select category_id
      from categories_homes
      where (
        category_id NOT IN (select category_id from categories_homes where home_id = 4)
      )
    `)

    const missingCategoryIds = missingCategoryIdsQuery
      .rows
      .map(({ category_id }: { category_id: number }) => ({
        category_id, home_id
      }));

    await dbConnection('categories_homes').insert(missingCategoryIds);
  }
};

export default reconcileCategories;
