import React from 'react';
import Relay from 'react-relay';

import ItemGridEntry from './ItemGridEntry';

class ItemGrid extends React.Component {
    render() {
        return(
            <div className="col-md-12">
                <div className="card-columns">
                    {
                        this.props.user.items.edges.map(function(edge, index) {
                            return <ItemGridEntry key={edge.node.id} item={edge.node} />
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Relay.createContainer(ItemGrid, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                items(first: 20) {
                    edges {
                        node {
                            id
                            ${ItemGridEntry.getFragment('item')}
                        }
                    }
                }
            }
        `,
    },
});
