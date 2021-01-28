import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import serverFetch from './utils/serverFetch';

const Nav = () => {
  const location = useLocation();
  const history = useHistory();

  const signOut = async (e: MouseEvent) => {
    e.preventDefault();

    const userResp = await serverFetch('/current');

    console.log(userResp);
    const user = await userResp.json();

    const resp = await serverFetch(`/users/${user.user_id}`, {
      method: 'DELETE'
    });

    console.log(resp);

    if (resp.ok) {
      history.push('/login')
    }
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <div className='container container-fluid'>
        <a className='navbar-brand' href='#'>Home Score</a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link
                className={`nav-link ${location.pathname === '/homes' && 'active'}`}
                to='/homes'
              >
                Homes
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={`nav-link ${location.pathname === '/categories' && 'active'}`}
                to='/categories'
              >
                Categories
              </Link>
            </li>
            <li className='nav-item'>
              <button type='button' className='btn btn-warning' onClick={signOut}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
