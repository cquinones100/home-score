import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Index from './homes/Index';
import Show from './homes/Show';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/homes/:id' component={Show} />
        <Route path='/homes' component={Index} />
      </Switch>
    </Router>
  );
}

export default App;
