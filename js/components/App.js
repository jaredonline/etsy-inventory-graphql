import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';
import NewItemMutation from '../mutations/NewItem';

var AppComponent = React.createClass({
  handleFormUpdate(event) {
    var item;
    item = this.state.newItem;
    switch (event.target.id) {
        case "itemName":
            item.name = event.target.value;
            break;
        case "purchasePrice":
            item.purchase_price = event.target.value;
            break;
        case "salePrice":
            item.sale_price = event.target.value;
            break;
    }
    this.setState({newItem: item});
  },
  handleFormSubmit(event) {
    event.preventDefault();
    Relay.Store.update(new NewItemMutation({item: this.state.newItem, me: null}));
  },
  getInitialState() {
    return {
        newItem: {
            name: "",
            purchase_price: "",
            sale_price: "",
        }
    }
  },
  render() {
    var itemDisplay, mode, newItem;
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

    newItem = this.state.newItem;
    return (
      <div className="container">
        <div className="row">
            <div className="col-md-8">
                <h1>Item list ({this.props.me.items.edges.length})</h1>
                <button className="btn btn-primary">New Item</button>
            </div>
            <div className="col-md-4">
                <Link to="/grid" className="btn btn-primary" activeClassName="active">Grid</Link>
                <Link to="/list" className="btn btn-primary" activeClassName="active">List</Link>
            </div>
        </div>
        <div className="row">
            <form onSubmit={this.handleFormSubmit}>
                <fieldset className="form-group">
                    <label htmlFor="itemName">Item Name</label>
                    <input type="text" value={newItem.name} onChange={this.handleFormUpdate} className="form-control" id="itemName" placeholder="Enter the name of the item here" />
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="purchasePrice">Purchase Price (in cents)</label>
                    <input type="text" value={newItem.purchase_price} onChange={this.handleFormUpdate} className="form-control" id="purchasePrice" placeholder="Enter the purchase price" />
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="salePrice">Sale Price (in cents)</label>
                    <input type="text" value={newItem.sale_price} onChange={this.handleFormUpdate} className="form-control" id="salePrice" placeholder="Enter the sale price" />
                </fieldset>
                <button type="submit" className="btn btn-primary" >Save Item</button>
            </form>
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
        items(first: 20) {
            edges
        }
        ${ItemTable.getFragment('user')}
      }
    `,
  },
});
