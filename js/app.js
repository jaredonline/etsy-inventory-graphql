import 'babel/polyfill';

import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Route, Link, IndexRoute } from 'react-router';
import { RelayRouter } from 'react-router-relay';

const RootQueries = {
    me: () => Relay.QL` query { me } `
};

const routes = (
    <Route
        path="/"
        component={App}
        queries={RootQueries}
    />
);

console.log(routes)

ReactDOM.render((
  <RelayRouter routes={routes} />
), document.getElementById('root'));
