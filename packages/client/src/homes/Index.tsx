import React, { FC, FormEvent, Fragment, MouseEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeWithImageUrls from "../../../../src/types/HomeWithImageUrls";
import serverFetch from "../utils/serverFetch";
import { homeShowUrl } from "./Show";

type AddHomeType = {
  url: string;
  address: string;
}

const Index: FC = () => {
  const [homes, setHomes] =
    useState<HomeWithImageUrls[]>(null as unknown as HomeWithImageUrls[]);

  const [addHome, setAddHome] = useState<AddHomeType>(null as unknown as AddHomeType);

  useEffect(() => {
    const getResp = async () => {
      const resp = await serverFetch('/homes', {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const json = await resp.json();

      setHomes(json);
    };

    if (!homes) getResp();
  }, [homes]);

  const handleAddOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setAddHome({
      url: '',
      address: ''
    })
  };
  
  const handleFormAddSubmit = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const resp = await serverFetch('/homes', {
      method: 'POST',
      body: JSON.stringify(addHome)
    });

    if (resp.ok) {
      setAddHome(null as unknown as AddHomeType);
      setHomes(null as unknown as HomeWithImageUrls[]);
    }
  };

  if (!homes) { 
    return <div>Loading...</div>
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Url</th>
            <th>Score</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
            homes && (homes as HomeWithImageUrls[]).map((home, index) => {
              return (
                <Fragment key={index}>
                  <tr>
                    <td>{home.address}</td>
                    <td><a href={home.url}>{home.url}</a></td>
                    <td>
                      {home.score ? (home.score * 100).toFixed(2) : 'No Score Yet'}
                    </td>
                    <td>
                      <Link to={homeShowUrl(home.home_id, { useRoot: false })}>
                        View
                      </Link>
                    </td>
                  </tr>
                </Fragment>
              );
            })
          }
        </tbody>
      </table>
      { !addHome && <button onClick={handleAddOnClick}>Add Home</button> }
      { addHome && (
        <form onSubmit={handleFormAddSubmit}>
          <label htmlFor='address'>Address</label>
          <input
            id='address'
            name='address'
            value={addHome.address || ''}
            onChange={e => { setAddHome({ ...addHome, address: e.target.value })}}
          />
          <label htmlFor='url'>URL</label>
          <input
            id='url'
            name='url'
            value={addHome.url || ''}
            onChange={e => { setAddHome({ ...addHome, url: e.target.value })}}
          />
          <button type='submit'>Submit</button>
        </form>
      )}
    </>
  );
}

export default Index;
