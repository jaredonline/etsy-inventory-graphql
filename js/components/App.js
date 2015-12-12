import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';
import Nav from './Nav';
import ItemForm from './Item/Form';

import NewItemMutation from '../mutations/NewItem';

var AppComponent = React.createClass({
  toggleForm(event) {
    event.preventDefault();
    this.setState({showForm: !this.state.showForm})
  },
  getInitialState() {
    return {
        showForm: false,
    }
  },
  render() {
    var itemDisplay, mode, formDisplay;
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

    formDisplay = (this.state.showForm === false) ? "none" : "inherit";
    return (
    <div>
      <Nav />
      <div className="container-fluid">
        <div className="row">
            <div className="col-md-8">
                <h1>Item list ({this.props.me.items.edges.length})</h1>
            </div>
            <div className="col-md-4">
                <Link to="/grid" className="btn btn-primary" activeClassName="active">Grid</Link>
                <Link to="/list" className="btn btn-primary" activeClassName="active">List</Link>
            </div>
        </div>
        <div >
            <ItemForm key={this.props.me.id} user={this.props.me} />
        </div>
        <div className="row">
            {itemDisplay}
        </div>
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
        items(first: 20) {
            edges
        }
        ${ItemForm.getFragment('user')}
        ${ItemGrid.getFragment('user')}
        ${ItemTable.getFragment('user')}
      }
    `,
  },
});
