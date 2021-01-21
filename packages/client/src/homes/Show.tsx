import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Category from "../../../../src/types/Category";
import Home from '../../../../src/types/HomeWithImageUrls';
import serverFetch from "../utils/serverFetch";

type Props = {
  match: {
    params: {
      id: number,
      user_name: string
    }
  }
};

type HomeShowUrlConfigType = {
  user_name?: string;
  useRoot?: boolean
};

const fetchHome = async (id: number, user_name: string, cb: (arg: Home) => void) => {
  const resp =
    await serverFetch(homeShowUrl(id, { user_name, useRoot: false }), {
      headers: {
        'Content-Type': 'application/json'
      },
    });

  const json = await resp.json();

  cb(json);
}

export const homeShowUrl =
  (id: number, { user_name, useRoot = true }: HomeShowUrlConfigType): string => {
    let tail = '';
    let root = 'http://localhost:3001';

    if (user_name) { tail = '?user_name=${user_name}' }

    if (!useRoot) { root = ''; }

    return `${root}/homes/${id}${tail}`;
  }

const Show: FC<Props> = (props) => {
  const [home, setHome] = useState<Home>(null as unknown as Home);

  const { id, user_name } = props.match.params;

  useEffect(() => {
    if (!home) fetchHome(id, user_name, (json) => setHome(json));
  }, [home, id, user_name])

  const onChangeCategory =
    (e: ChangeEvent<HTMLInputElement>, category: Category) => {
      const newHome = {
        ...home,
        categories: home?.categories?.map((mapCategory) => {
          if (mapCategory.category_id === category.category_id) {
            return ({
              ...category,
              score: Number(e.target.value)
            })
          } else {
            return mapCategory;
          }
        })
      };

      setHome(newHome);
    };

  const onBlurCategoryInput =
    (e: ChangeEvent<HTMLInputElement>, category: Category) => {
      const updateCategory = async () => {
        if (category) {
          const resp = await serverFetch(
            `/categories`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
              value: Number(e.target.value),
              category_id: category.category_id,
              user_id: category.user_id,
              home_id: home.home_id
            })
          });

          if (resp.ok) {
            fetchHome(id, user_name, (json) => setHome(json))
          } else {
            alert('there was an error on the server side');
          }
        }
      };

      updateCategory();
    };

  if (home) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const screenshot = require(`../../../server/snapshots/${home.address}.png`);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '100vh'
        }}
      >
        <h1>{home.address}</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: '20%'
          }}>
          {home.image_urls.map(imageUrl => {
            return (
              <img
                key={imageUrl}
                alt={home.address}
                src={imageUrl}
                style={{ objectFit: 'cover', width: '33%' }}
              />
            )
          })}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'auto'
          }}
        >
          <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
            {
              home && (home?.categories?.length || 0) > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Weight</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      home && home.categories?.map((category, index) => {
                        return (
                          <tr key={index}>
                            <td>{category.name}</td>
                            <td>
                              {category.weight}
                            </td>
                            <td>
                              <input
                                value={category.score}
                                onChange={e => onChangeCategory(e, category)}
                                onBlur={e => onBlurCategoryInput(e, category)}
                              />
                            </td>
                          </tr>
                        );
                      })
                    }
                    <tr>
                      <td />
                      <td />
                      <td>{home.score}</td>
                    </tr>
                  </tbody>
                </table>
              )
            }
          </div>
          <div style={{ overflow: 'auto', flexGrow: 1 }}>
            <img src={screenshot}/>
          </div>
        </ div>
      </div>
    )
  }

  return <div />;
}

export default Show;
