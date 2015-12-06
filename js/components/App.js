import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';

var AppComponent = React.createClass({
  render() {
    var itemDisplay, mode;
    if (this.props.params.mode !== null && this.props.params.mode !== "" && this.props.params.mode !== undefined) {
        mode = this.props.params.mode;
    } else {
        mode = "grid";
    }
    if (mode == "grid") {
        itemDisplay = <ItemGrid key={this.props.me.id} user={this.props.me} />
    } else if (mode == "list") {
        itemDisplay = <ItemTable key={this.props.me.id} user={this.props.me} />
    }
    return (
      <div className="container">
        <div className="row">
            <div className="col-md-8">
                <h1>Item list ({this.props.me.items.length})</h1>
                <p>{this.props.me.email}</p>
            </div>
            <div className="col-md-4">
                <Link to="/grid" className="btn btn-primary" activeClassName="active">Grid</Link>
                <Link to="/list" className="btn btn-primary" activeClassName="active">List</Link>
            </div>
        </div>
        <div className="row">
            {itemDisplay}
        </div>
      </div>
    );
  }
})

export default Relay.createContainer(AppComponent, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        id
        email
        items
        ${ItemTable.getFragment('user')}
        ${ItemGrid.getFragment('user')}
      }
    `,
  },
});
