import dbConnection from "../dbConnection";

const getHomes = ({ user_id }: { user_id?: number } = {}) => {
  const userIdQuery = user_id ?
    dbConnection.raw(`where user_id = ?`, [user_id]) :
    null;

  const bindings = [userIdQuery].filter((binding) => binding !== null);

  const query = dbConnection.raw(`
    with users_categories_homes as (
      select users.user_id,
        users.name    as user_name,
        case
          when count(categories_homes.*) = 0
            then
            '{}'
          else
            array_agg(
              jsonb_build_object(
                'name', categories.name,
                'weight', categories.weight,
                'score', categories_homes.value,
                'user_id', categories.user_id,
                'category_id', categories.category_id
              )
              order by categories.name
            )
          end as categories,
        homes.home_id,
        sum(categories_homes.value * weight) / sum(categories.weight * 10) as score
      from users
        left outer join categories using (user_id)
        left outer join categories_homes using (category_id)
        full outer join homes using (home_id)
      group by users.user_id, homes.home_id
    )

    select
      categories,
      homes.url,
      address,
      homes.home_id,
      users_categories_homes.user_name as user_name,
      array_agg(
        jsonb_build_object(
            'user_name', user_name,
            'score', score
        )
      ) as scores,
      avg(score) as score,
      categories,
      array_agg(home_image_urls.url) as image_urls
    from homes
    left join home_image_urls using (home_id)
    full join users_categories_homes on true
    ${userIdQuery === null ? '' : '?'}
    group by categories, homes.url, homes.address, homes.home_id, user_name
  `, bindings)

  return (
    dbConnection.from(dbConnection.raw(`(?) as homes_query`, [query]))
  );
};

export default getHomes;
