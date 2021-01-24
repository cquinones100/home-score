import React, { FC } from 'react';
import {
  Switch,
  Route,
  RouterProps,
  BrowserRouter as Router,
} from 'react-router-dom';
import Index from './homes/Index';
import Show from './homes/Show';
import Login from './Login';
import Nav from './Nav';
import PrivateRoute from './PrivateRoute';
import CategoryIndex from './categories/Index';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Nav />
      <div className='container container-fluid'>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <PrivateRoute
            path={'/homes/:id'}
            component={Show as unknown as FC<RouterProps>}
          />
          <PrivateRoute path='/homes' component={Index} />
          <PrivateRoute path='/Categories' component={CategoryIndex} />
          <PrivateRoute path='/' component={CategoryIndex} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
