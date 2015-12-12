import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

import NewItemMutation from '../../mutations/NewItem';

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
            case "shippingProfile":
                item.shipping_profile = event.target.value;
                break;
        }
        this.setState({newItem: item});
    },
    handleFormSubmit(event) {
        event.preventDefault();
        this.setState({showForm: false});
        Relay.Store.update(new NewItemMutation({item: this.state.newItem, me: null}));
        this.setState({newItem: this._newItem()})
    },
    _newItem() {
        return {
            name: "",
            purchase_price: "",
            sale_price: "",
            shipping_profile: "1",
        }
    },
    getInitialState() {
        return {
            showForm: false,
            newItem: this._newItem(),
        }
    },
    toggleForm(event) {
        event.preventDefault();
        this.setState({showForm: !this.state.showForm})
    },
    render() {
        var newItem, formDisplay;
        newItem = this.state.newItem;
        formDisplay = (this.state.showForm === false) ? "none" : "inherit";
        return(
            <div>
                <div className="row">
                    <div className="col-md-1">
                        <button className="btn btn-primary" onClick={this.toggleForm}>New Item</button>
                    </div>
                </div>
                <div className="row" style={{display: formDisplay}}>
                    <div className="col-md-12">
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
                            <fieldset className="form-group">
                                <label htmlFor="shippingProfile">Shipping Profile</label>
                                <select className="form-control" id="shippingProfile" onChange={this.handleFormUpdate}>
                                    {
                                        this.props.user.shipping_profiles.edges.map(function(edge, index) {
                                            return <option key={edge.node.id} value={edge.node.raw_id}>{edge.node.name}</option>
                                        })
                                    }
                                </select>
                            </fieldset>
                            <button type="submit" className="btn btn-primary">Save Item</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
})

export default Relay.createContainer(AppComponent, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        shipping_profiles(first: 20) {
            edges {
                node {
                    id
                    raw_id
                    name
                    cost_in_cents
                }
            }
        }
      }
    `,
  },
});
