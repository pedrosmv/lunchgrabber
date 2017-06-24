import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route,IndexRoute, browserHistory} from 'react-router';
import Intro from './pages/intro';
import Location from './pages/location';
import Suggestions from './pages/suggestions'
import 'bootstrap/dist/css/bootstrap.css'


ReactDOM.render(
 <Router history={browserHistory}>
  <Route path ="/" component={Intro}/>
  <IndexRoute component={Intro}/>
  <Route path="location" component={Location} />
  <Route path="suggestions" component={Suggestions} />
 </Router>,
 document.getElementById('root')
);
