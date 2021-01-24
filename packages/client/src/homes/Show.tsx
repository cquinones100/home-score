import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Category from "../../../../src/types/Category";
import Home from '../../../../src/types/HomeWithImageUrls';
import config from "../../config";
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
    let root = config.SERVER_ROOT;

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
              score: e.target.value as unknown as number
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
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '90vh'
        }}
      >
        <h1>{home.address}</h1>
        <div style={{ width: '100%', height: '20%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              height: '100%',
              overflowX: 'auto'
            }}>
            {home.image_urls.filter(imageUrl => imageUrl !== null).map(imageUrl => {
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
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'auto'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '50%',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <h1 style={{ textAlign: 'right' }}>
              Current Score {(home.score * 10).toFixed(2)}
            </h1>
            {
              home && (home?.categories?.length || 0) > 0 && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'row'}}>
                    <div style={{ width: '33%'}}>
                      Category
                    </div>
                    <div style={{ width: '33%'}}>
                      Weight
                    </div>
                    <div style={{ width: '33%'}}>
                      Score
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}
                  >
                    {
                      home && home.categories?.map((category, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              overflow: 'auto'
                            }}
                          >
                            <div style={{ width: '33%'}}>
                              {category.name}
                            </div>
                            <div style={{ width: '33%'}}>
                              {category.weight}
                            </div>
                            <div style={{ width: '33%'}}>
                              <input
                                style={{ width: '100%' }}
                                value={category.score}
                                onChange={e => onChangeCategory(e, category)}
                                onBlur={e => onBlurCategoryInput(e, category)}
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </>
              )
            }
          </div>
        </ div>
      </div>
    )
  }

  return <div />;
}

export default Show;
