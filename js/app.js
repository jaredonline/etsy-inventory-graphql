import 'babel/polyfill';

import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';
import ItemView from './components/ItemView';
import ItemViewRoute from './routes/ItemViewRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

ReactDOM.render(
  <Relay.RootContainer
    Component={ItemView}
    route={new ItemViewRoute({itemId: '1'})}
  />,
  document.getElementById('root')
);
