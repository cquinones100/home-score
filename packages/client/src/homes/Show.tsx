import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Home from '../../../../src/types/HomeWithImageUrls';

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
    const fetchHome = async () => {
      console.log(homeShowUrl(id, { user_name }));

      const resp = 
        await fetch(homeShowUrl(id, { user_name }), {
          headers: {
            'Content-Type': 'application/json'
          },
        });

      const json = await resp.json();

      setHome(json);
    }

    if (!home) fetchHome();
  }, [home, id, user_name])

  const onChangeCategory =
    (e: ChangeEvent<HTMLInputElement>, attribute: 'weight' | 'score') => {
      console.log('coming soon!')
    };

  if (home) {
    return (
      <>
        <h1>{home.address}</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: '20vh'
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
                          <input
                            value={category.weight}
                            onChange={e => onChangeCategory(e, 'weight')}
                          />
                        </td>
                        <td>
                          <input
                            value={category.weight}
                            onChange={e => onChangeCategory(e, 'score')}
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
      </>
    )
  }

  return <div />;
}

export default Show;
