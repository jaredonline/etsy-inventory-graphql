import React from 'react';
import Relay from 'react-relay';

class ItemView extends React.Component {
    render() {
        return(
          <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>{this.props.me.item.name}</h1>
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
                }
            }
        `,
    },
    initialVariables: {
        itemId: '1'
    },
});
