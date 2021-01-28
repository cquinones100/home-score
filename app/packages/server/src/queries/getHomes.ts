import dbConnection from "../dbConnection";

const getHomes = ({ user_id, home_id }: { user_id?: number, home_id?: number } = {}) => {
  const userIdQuery = user_id ?
    dbConnection.raw(`where user_id = ?`, [user_id]) :
    null;

  let homeIdQuery = null;

  if (user_id && home_id) {
    homeIdQuery = dbConnection.raw(`AND homes.home_id = ?`, [home_id]);
  } else if (home_id) {
    homeIdQuery = dbConnection.raw(`WHERE homes.home_id = ?`, [home_id]);
  }

  const bindings = [userIdQuery, homeIdQuery]
    .filter((binding) => binding !== null);

  const query = dbConnection.raw(`
    select
      user_id,
      url,
      address,
      case
        when count(value) = 0
          then
          '{}'
        else
          array_agg(
                  jsonb_build_object(
                          'name', categories_name,
                          'weight', categories_weight,
                          'score', value,
                          'user_id', user_id,
                          'category_id', category_id
                    )
                  order by categories_name
            )
        end as categories,
      home_id,
      sum(value * categories_weight) / sum(categories_weight * 10) as score,
      array_agg(distinct(home_image_url_id)) as image_urls
    from (
      select
        distinct on (categories.name)
        categories.*,
        homes.url,
        homes.home_id,
        homes.address,
        categories_homes.value,
        categories.name as categories_name,
        categories.weight as categories_weight,
        home_image_urls.home_image_url_id
      from users
        left outer join categories using (user_id)
        left outer join categories_homes using (category_id)
        left join home_image_urls using (home_id)
        left join homes using (home_id)
      ${userIdQuery === null ? '' : '?'}
      ${homeIdQuery === null ? '' : '?'}
    ) as inner_q
    group by user_id, home_id, url, address
  `, bindings)

  return (
    dbConnection.from(dbConnection.raw(`(?) as homes_query`, [query]))
  );
};

export default getHomes;
