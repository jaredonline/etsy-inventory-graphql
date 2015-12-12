import React from 'react';
import Relay from 'react-relay';

import Nav from '../Nav';

class ItemEditView extends React.Component {
    updateForm(event) {
        var item;
        item = this.props.me.item;
        switch (event.target.id) {
            case "name":
                item.name = event.target.value;
                break;
        }
    }

    render() {
        var item;
        item = this.props.me.item;
        return(
            <div>
                <Nav />
                <div className="container">
                    <div className="col-md-12">
                        <h1>Edit {item.name}</h1>
                        <form onChange={this.updateForm}>
                            <fieldset className="form-group">
                                <label htmlFor="name">Name</label>
                                <input onChange={this.updateForm} type="text" className="form-control" id="name" value={item.name} placeholder="Name of the item" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="purchasePriceCents">Purchase Price</label>
                                <input onChange={this.updateForm} type="text" className="form-control" id="purchasePriceCents" value={item.purchase_price_cents} placeholder="Price you paid for the item" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="salePriceCents">Sale Price</label>
                                <input onChange={this.updateForm} type="text" className="form-control" id="salePriceCents" value={item.sale_price_cents} placeholder="Price you plan on selling the item for" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="shippingProfile">Shipping Profile</label>
                                <select defaultValue={item.shipping_profile.raw_id} className="form-control" id="shippingProfile" onChange={this.handleFormUpdate}>
                                    {
                                        this.props.me.shipping_profiles.edges.map(function(edge, index) {
                                            var selected = (edge.node.id == item.shipping_profile.id) ? "selected" : false;
                                            return <option key={edge.node.id} value={edge.node.raw_id}>{edge.node.name}</option>
                                        })
                                    }
                                </select>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Relay.createContainer(ItemEditView, {
    fragments: {
        me: () => Relay.QL`
            fragment on User {
                item(id: $itemId) {
                    id
                    name
                    purchase_price_cents
                    sale_price_cents
                    shipping_profile {
                        id
                        raw_id
                        name
                    }
                }

                shipping_profiles(first: 20) {
                    edges {
                        node {
                            id
                            raw_id
                            name
                        }
                    }
                }
            }
        `,
    },
    initialVariables: {
        itemId: '1'
    },
});
