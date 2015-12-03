import React from 'react';
import Relay from 'react-relay';

import ItemTable from './ItemTable';

var AppComponent = React.createClass({
  getInitialState() {
    return {grid: false};
  },
  toggleGrid() {
    this.setState({grid: !this.state.grid});
  },
  render() {
    var itemDisplay, gridToggleText;
    if (this.state.grid) {
        gridToggleText = "View as a list";
        itemDisplay = <div />
    } else {
        gridToggleText = "View as a grid";
        itemDisplay = <ItemTable key={this.props.me.id} user={this.props.me} />
    }
    return (
      <div className="container">
        <div className="row">
            <div className="col-md-12">
                <h1>Item list ({this.props.me.items.length}) <a onClick={this.toggleGrid}>{gridToggleText}</a></h1>
                <p>{this.props.me.email}</p>
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
      }
    `,
  },
});
