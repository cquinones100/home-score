import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import serverFetch from './utils/serverFetch';
import User from '../../../src/types/User';
import { Redirect } from 'react-router-dom';

const Login: FC = () => {
  const [users, setUsers] = useState(null as unknown as User[]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null as unknown as User);

  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await serverFetch('/users');

      if (resp.ok) {
        const users = await resp.json();

        setUsers(users);
      } else {
        alert('there was an error');
      }
    };

    if (users === null) fetchUsers();
  }, [users])

  const handleUserClick = async (e: ChangeEvent<HTMLSelectElement>) => {
    const user = users.find(user => Number(user.user_id) === Number(e.target.value));

    if (user) {
      const resp = await serverFetch('/users', {
        method: 'POST',
        body: JSON.stringify(user)
      })

      if (resp.ok) {
        setAuthenticatedUser(user);
      } else {
        alert('there was an error');
      }
    }
  };

  if (authenticatedUser) {
    return <Redirect to='/homes' />
  }

  return (
    <>
      <h1>Who are you?</h1>
      {users && (
        <select value={''} onChange={handleUserClick}>
          <option  value={''} />
          {
            (users as User[]).map(user => {
              return (
                <option
                  key={user.user_id}
                  value={user.user_id}
                >
                  {user.name}
                </option>
              );
            })
          }
        </select>
      )}
    </>
  );
};

export default Login;
