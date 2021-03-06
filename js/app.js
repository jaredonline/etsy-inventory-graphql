import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';
import { Route, Link, IndexRoute } from 'react-router';

import App from './components/App';
import ItemView from './components/ItemView';
import ItemEditView from './components/Item/Edit';
import ShippingProfilesView from './components/ShippingProfilesView';

import RootQuery from './queries/RootQuery';
import ItemViewQuery from './queries/ItemViewQuery';

ReactDOM.render((
    <RelayRouter>
        <Route path="/shipping_profiles" components={ShippingProfilesView} queries={RootQuery} />
        <Route path="/" component={App} queries={RootQuery}>
            <IndexRoute component={App} queries={RootQuery} prepareParams={() => ({mode: "list"})} />
            <Route component={App} queries={RootQuery} path=":mode" />
        </Route>
        <Route path="/item/:itemId" component={ItemView} queries={ItemViewQuery} />
        <Route path="/item/:itemId/edit" component={ItemEditView} queries={RootQuery} />
    </RelayRouter>
), document.getElementById('root'));
