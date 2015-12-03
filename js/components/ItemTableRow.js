import React from 'react';
import Relay from 'react-relay';
import act   from 'accounting';

class ItemTable extends React.Component {
    render() {
        return(
            <tr>
                <td><a href="#">{this.props.item.name}</a></td>
                <td>{act.formatMoney(this.props.item.sale_price_cents / 100, "")}</td>
                <td>{act.formatMoney(this.props.item.purchase_price_cents / 100, "")}</td>
            </tr>
        );
    }
}

export default Relay.createContainer(ItemTable, {
    fragments: {
        item: () => Relay.QL`
            fragment on Item {
                name
                sale_price_cents
                purchase_price_cents
            }
        `,
    },
});
