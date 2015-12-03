import 'babel/polyfill';

import App from './components/App';
import ItemView from './components/ItemView';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Route, Link, IndexRoute } from 'react-router';
import { RelayRouter } from 'react-router-relay';
import createBrowserHistory from 'history/lib/createBrowserHistory'

const RootQueries = {
    me: () => Relay.QL` query { me } `
};


ReactDOM.render((
    <RelayRouter>
        <Route path="/" component={App} queries={RootQueries} />
        <Route path="/item/:itemId" component={ItemView} queries={RootQueries} />
    </RelayRouter>
), document.getElementById('root'));
