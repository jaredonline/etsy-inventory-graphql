import React from 'react';
import Relay from 'react-relay';
import act   from 'accounting';

import Nav from './Nav';

class ItemView extends React.Component {
    render() {
        var item;
        item = this.props.me.item;
        return(
            <div>
                <Nav />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1>{item.name}</h1>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Purchase Price</th>
                                        <th>Sale Price</th>
                                        <th>Potential Profit</th>
                                        <th>Shipping Profile</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{act.formatMoney(item.purchase_price_cents / 100, "")}</td>
                                        <td>{act.formatMoney(item.sale_price_cents / 100, "")}</td>
                                        <td>{act.formatMoney(item.potential_profit_cents / 100, "")}</td>
                                        <td>{item.shipping_profile.name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Shipping Profile Details</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Shipping Cost</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{item.shipping_profile.name}</td>
                                        <td>{act.formatMoney(item.shipping_profile.cost_in_cents / 100, "")}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Relay.createContainer(ItemView, {
    fragments: {
        me: () => Relay.QL`
            fragment on User {
                item(id: $itemId) {
                    id
                    name
                    purchase_price_cents
                    sale_price_cents,
                    potential_profit_cents,
                    shipping_profile {
                        name
                        cost_in_cents
                    }
                }
            }
        `,
    },
    initialVariables: {
        itemId: '1'
    },
});
