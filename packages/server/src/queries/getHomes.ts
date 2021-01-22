import dbConnection from "../dbConnection";

const getHomes = ({ user_id }: { user_id?: number } = {}) => {
  const userIdQuery = user_id ?
    dbConnection.raw(`where user_id = ?`, [user_id]) :
    null;

  const bindings = [userIdQuery].filter((binding) => binding !== null);

  const query = dbConnection.raw(`
    select
      url,
      address,
      home_id,
      array_agg(
        jsonb_build_object(
          'user_name', user_name,
          'score', score
        )
      ) as scores,
      avg(score) as score,
      categories,
      array_agg(home_image_urls_url) as image_urls
    from (
      select
        homes.url,
        address,
        homes.home_id,
        users.name as user_name,
        sum(value * weight) / sum(weight * 10) as score,
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
        home_image_urls.url as home_image_urls_url
      from homes
        left join categories_homes using(home_id)
        left join categories using(category_id)
        left join users using(user_id)
        left join home_image_urls using(home_id)
      ${userIdQuery === null ? '' : '?'}
      group by homes.url, address, users.name, homes.home_id, home_image_urls.url
    ) as inner_query
    where home_image_urls_url is not null
    group by url, address, home_id, categories
  `, bindings)

  return (
    dbConnection.from(dbConnection.raw(`(?) as homes_query`, [query]))
  );
};

export default getHomes;
