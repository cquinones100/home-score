import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import serverFetch from './utils/serverFetch';
import User from '../../../src/types/User';
import { Link, Redirect } from 'react-router-dom';

type UserWithPassword = {
  name: string;
  password: string;
};

const Login: FC = () => {
  const [user, setUser] =
    useState<UserWithPassword>({ name: '', password: ''})
  const [authenticatedUser, setAuthenticatedUser] =
    useState(null as unknown as User);

    console.log('hiiiiiiiiii')

  const handleFormAddSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const resp = await serverFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify(user)
      })

      if (resp.ok) {
        setAuthenticatedUser({ name: user.name } as User);
      } else {
        alert('there was an error');
      }
    }
  };

  if (authenticatedUser) {
    console.log('hi')
    return <Redirect to='/homes' />
  }

  return (
    <>
      <h1>Who are you?</h1>
      <form onSubmit={handleFormAddSubmit}>
        <div className='mb-2'>
          <label htmlFor='name' className='form-label'>Name</label>
          <input
            id='name'
            name='name'
            value={user.name || ''}
            onChange={e => { setUser({ ...user, name: e.target.value })}}
            className='form-control'
          />
        </div>
        <div className='mb-2'>
          <label htmlFor='password' className='form-label'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={user.password || ''}
            onChange={e => { setUser({ ...user, password: e.target.value })}}
            className='form-control'
          />
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
      <Link to='/signup'>Signup</Link>
    </>
  );
};

export default Login;
