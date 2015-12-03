import React from 'react';
import Relay from 'react-relay';

import ItemTable from './ItemTable';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
            <div className="col-md-12">
                <h1>Item list ({this.props.me.items.length})</h1>
                <p>{this.props.me.email}</p>
            </div>
        </div>
        <div className="row">
            <ItemTable key={this.props.me.id} user={this.props.me} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(AppComponent, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        id
        email
        items
        ${ItemTable.getFragment('user')}
      }
    `,
  },
});
