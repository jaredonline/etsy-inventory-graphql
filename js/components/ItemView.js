import React from 'react';
import Relay from 'react-relay';
import act   from 'accounting';
import {Link} from 'react-router';

import Nav from './Nav';

class ItemView extends React.Component {
    render() {
        var item, editPath;
        item = this.props.me.item;
        editPath = "/item/" + item.raw_id + "/edit";
        return(
            <div>
                <Nav />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1>{item.name} <Link to={editPath}>edit</Link></h1>
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
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Payment Provider Details</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Listing Fee</th>
                                        <th>Percentage Fee</th>
                                        <th>Percentage for this Item</th>
                                        <th>Flat Fee</th>
                                        <th>Total Fees</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.props.payment_connection.edges.map(function(edge, index) {
                                            var provider, percentageCents, total;
                                            provider = edge.node;
                                            percentageCents = item.sale_price_cents * (provider.percentage_fee_bp / 1000);
                                            total = percentageCents + provider.listing_fee_cents + provider.flat_fee_cents;
                                            return (
                                                <tr key={provider.id}>
                                                    <td>{provider.name}</td>
                                                    <td>{act.formatMoney(provider.listing_fee_cents / 100, "")}</td>
                                                    <td>{act.formatMoney(provider.percentage_fee_bp / 10, "")}%</td>
                                                    <td>{act.formatMoney(percentageCents / 100, "")}</td>
                                                    <td>{act.formatMoney(provider.flat_fee_cents / 100, "")}</td>
                                                    <td>{act.formatMoney(total / 100, "")}</td>
                                                </tr>
                                            )
                                        })
                                    }
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
                    raw_id
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
        payment_connection: () => Relay.QL`
            fragment on PaymentProviderConnection {
                edges {
                    node {
                        id
                        name
                        listing_fee_cents
                        percentage_fee_bp
                        flat_fee_cents
                    }
                }
            }
        `,
    },
    initialVariables: {
        itemId: '1'
    },
});
