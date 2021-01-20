import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import './App.css';

type Category = {
  name: string;
  weight: number;
  score: number;
}

type Home = {
  home_id: number;
  url: string;
  address: string;
  score: number;
  user_name: string;
  categories?: Category[];
  image_urls: string[];
}

function App() {
  const [homes, setHomes] = useState<Home[]>(null as unknown as Home[]);
  const [editing, setEditing] = useState<Home>(null as unknown as Home);
  const [viewing, setViewing] = useState<Home>(null as unknown as Home);

  useEffect(() => {
    const getResp = async () => {
      const resp = await fetch('/homes', {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const json = await resp.json();

      setHomes(json);
    };

    if (!homes) getResp();
  }, [homes]);

  useEffect(() => {
    const getResp = async () => {
      const resp = await fetch(`/homes/${editing.home_id}?user_name=${editing.user_name}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const json = await resp.json();

      setViewing(json);
    };

    if (editing) getResp();
  }, [editing]);

  const onChangeCategory =
    (e: ChangeEvent<HTMLInputElement>, attribute: 'weight' | 'score') => {
      console.log('coming soon!')
    };

  if (!homes) return <div>Loading...</div>;

  if (viewing) {
    return (
      <>
        <h1>{viewing.address}</h1>
        {viewing.image_urls.map(imageUrl => {
          return (
            <img alt={viewing.address} src={imageUrl} />
          )
        })}
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
              viewing!.categories!.map((category, index) => {
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
              <td>{viewing.score}</td>
            </tr>
          </tbody>
        </table>
      </>
    )
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Url</th>
          <th>Score</th>
          <th>User</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {
          homes && (homes! as Home[]).map((home, index) => {
            return (
              <Fragment key={index}>
                <tr>
                  <td>{home.address}</td>
                  <td><a href={home.url}>{home.url}</a></td>
                  <td>{Number(home.score).toFixed(2)}</td>
                  <td>{home.user_name}</td>
                  <td><a href='#' onClick={() => setEditing(home)}>View</a></td>
                </tr>
              </Fragment>
            );
          })
        }
      </tbody>
    </table>
  );
}

export default App;
