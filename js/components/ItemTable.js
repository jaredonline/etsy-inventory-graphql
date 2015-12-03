import React from 'react';
import Relay from 'react-relay';

import ItemTableRow from './ItemTableRow';

class ItemTable extends React.Component {
    render() {
        return(
            <div className="col-md-12">
                <table className="table table-hover">
                    <thead className="thead-inverse">
                        <tr>
                            <th>Name</th>
                            <th>Sale Price</th>
                            <th>Purchase Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            this.props.user.items.map(function(item, index) {
                                return <ItemTableRow key={item.id} item={item} />
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
                items {
                    id
                    ${ItemTableRow.getFragment('item')}
                }
            }
        `,
    },
});
