import React from 'react';
import Relay from 'react-relay';

import ItemGridEntry from './ItemGridEntry';

class ItemTable extends React.Component {
    render() {
        return(
            <div className="col-md-12">
                <div className="card-columns">
                    {
                        this.props.user.items.map(function(item, index) {
                            return <ItemGridEntry key={item.id} item={item} />
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Relay.createContainer(ItemTable, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                items(first: 1) {
                    edges {
                        node {
                            ${ItemGridEntry.getFragment('item')}
                        }
                    }
                }
            }
        `,
    },
});
