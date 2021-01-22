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

function App() {
  return (
    <Router>
      <Nav />
      <div className='container'>
        <Switch>
          <Route path='/login' component={Login} />
          <PrivateRoute
            path={'/homes/:id'}
            component={Show as unknown as FC<RouterProps>}
          />
          <PrivateRoute path='/homes' component={Index} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
