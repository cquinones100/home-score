import React, { ChangeEvent, FC, RefObject, useState } from "react";
import { Redirect } from "react-router-dom";
import User from "../../../src/types/User";
import useInputFocus from "./hooks/useInputFocus";
import serverFetch from "./utils/serverFetch";

type UserWithPassword = {
  name: string;
  password: string;
};

const Signup: FC = () => {
  const [user, setUser] =
    useState<UserWithPassword>({ name: '', password: ''})

  const [authenticatedUser, setAuthenticatedUser] =
    useState(null as unknown as User);

  const handleFormAddSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const resp = await serverFetch('/users', {
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

  const inputRef = useInputFocus();

  if (authenticatedUser) {
    return <Redirect to='/homes' />
  }

  return (
    <div
      className='container container-fluid pt-5'
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h1>New User</h1>
      <form onSubmit={handleFormAddSubmit}>
        <div className='mb-2'>
          <label htmlFor='name' className='form-label'>Name</label>
          <input
            id='name'
            name='name'
            value={user.name || ''}
            onChange={e => { setUser({ ...user, name: e.target.value })}}
            className='form-control'
            ref={inputRef as RefObject<HTMLInputElement>}
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
    </div>
  );
};

export default Signup;
