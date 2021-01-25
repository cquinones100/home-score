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
  
  const handleFormAddSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      <div className='row'>
        <div className='col xs-4'>
          Address
        </div>
        <div className='col xs-4'>
          Score
        </div>
        <div className='col xs-4'>
        </div>
      </div>
      {
        homes && (homes as HomeWithImageUrls[]).map((home, index) => {
          return (
            <div key={index} className='row'>
              <div className='col xs-4'>
                {home.address}
              </div>
              <div className='col xs-4'>
                {home.score ? (home.score)?.toFixed(2) : 'No Score Yet'}
              </div>
              <div className='col xs-4'>
                <Link to={homeShowUrl(home.home_id, { useRoot: false })}>
                  View
                </Link>
              </div>
            </div>
          );
        })
      }
      { !addHome && (
        <button
          type='submit'
          className='btn btn-primary'
          onClick={handleAddOnClick}
        >
          Add Home
        </button>
      ) }
      { addHome && (
        <form onSubmit={handleFormAddSubmit}>
          <div className='mb-2'>
            <label htmlFor='address' className='form-label'>Address</label>
            <input
              id='address'
              name='address'
              value={addHome.address || ''}
              onChange={e => { setAddHome({ ...addHome, address: e.target.value })}}
              className='form-control'
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='url' className='form-label'>URL</label>
            <input
              id='url'
              name='url'
              value={addHome.url || ''}
              onChange={e => { setAddHome({ ...addHome, url: e.target.value })}}
              className='form-control'
            />
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      )}
    </>
  );
}

export default Index;
