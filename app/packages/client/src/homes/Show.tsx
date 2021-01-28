import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Category from "../../../../src/types/Category";
import Home from '../../../../src/types/HomeWithImageUrls';
import config from "../../config";
import serverFetch from "../utils/serverFetch";
import { sortBy } from 'lodash';

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
              value: e.target.value as unknown as number
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

  const handleImageUpload = async (e) => {
    const formData = new FormData();

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]

      formData.append('files', file, file.name);
    }

    const resp = await serverFetch(`/homes/${home.home_id}/home_image_urls`, {
      method: 'POST',
      body: formData
    }, { omit: ['headers'] });

    if (resp.ok) setHome(null as unknown as Home);
  };

  if (home) {
    return (
      <div className='row'>
        <h1>{home.address}</h1>
        <h2>
          <a href={home.url} target='_blank' rel='noreferrer' >
            Visit Listing Page
          </a>
        </h2>
        <div className='row'>
          <div className='col-md-6'>
            <div
              className='card'
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <div className='card-header'>
                <h1 style={{ textAlign: 'right' }}>
                  Current Score {(home.score || 0).toFixed(2)}
                </h1>
              </div>
              {
                home && (home?.categories?.length || 0) > 0 && (
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-6'>
                        Category
                      </div>
                      <div className='col-6'>
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
                        home && sortBy(home.categories, ['name'])?.map(
                          (category: Category, index: number) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflow: 'auto'
                                }}
                                className='m-2'
                              >
                                <div style={{ width: '50%' }}>
                                  {category.name}
                                </div>
                                <div style={{ width: '50%' }}>
                                  <input
                                    className='form-control'
                                    style={{ width: '100%' }}
                                    value={category.value || ''}
                                    onChange={e => {
                                      onChangeCategory(e, category)
                                    }}
                                    onBlur={e => {
                                      onBlurCategoryInput(e, category)
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )
                      }
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <div
            className='col-md-6'
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              className='mb-2 card'
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div className='card-body'>
                <div className='row'>
                  <div className='col-12'>
                    <input
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={handleImageUpload}
                      multiple
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='card'>
              <div className='card-body'>
                {
                  home.image_urls.filter((id) => id !== null).map((homeImageUrlId) => {
                    return (
                      <div className='row' key={homeImageUrlId}>
                        <div className='col-12'>
                          <img
                            src={
                              `${config.SERVER_ROOT}/homes/${home.home_id}/home_image_urls/${homeImageUrlId}`
                            }
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <div />;
}

export default Show;
