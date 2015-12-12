import React from 'react';
import Relay from 'react-relay';

import ItemTableRow from './ItemTableRow';

class ItemTable extends React.Component {
    render() {
        return(
            <div className="col-md-12">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Sale Price</th>
                            <th>Purchase Price</th>
                            <th>Potential Profit</th>
                            <th>Shipping Profile</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            this.props.user.items.edges.map(function(edge, index) {
                                return <ItemTableRow key={edge.node.id} item={edge.node} />
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Relay.createContainer(ItemTable, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                items(first: 20) {
                    edges {
                        node {
                            id
                            ${ItemTableRow.getFragment('item')}
                        }
                    }
                }
            }
        `,
    },
});
