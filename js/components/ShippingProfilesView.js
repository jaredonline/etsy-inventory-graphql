import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

import Nav from './Nav';

import act   from 'accounting';

class ShippingProfilesView extends React.Component {
    render() {
        return(
            <div>
                <Nav />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <h1>Shipping Profiles ({this.props.me.shipping_profiles.edges.length})</h1>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.props.me.shipping_profiles.edges.map(function(edge, index) {
                                            return (
                                                <tr key={edge.node.id}>
                                                    <td>{edge.node.name}</td>
                                                    <td>{act.formatMoney(edge.node.cost_in_cents / 100, "")}</td>
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

export default Relay.createContainer(ShippingProfilesView, {
    fragments: {
        me: () => Relay.QL`
            fragment on User {
                email
                shipping_profiles(first: 20) {
                    edges {
                        node {
                            id
                            cost_in_cents
                            name
                        }
                    }
                }
            }
        `
    },
});
