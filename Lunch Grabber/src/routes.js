import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Intro from './pages/intro'
import Location from './pages/location'

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Intro}>
      <IndexRoute component={Intro} />
      <Route path="/location" component={Location} />
    </Route>
  </Router>
)
