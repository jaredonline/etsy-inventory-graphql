import Relay from 'react-relay';

class NewItem extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                newItem
            }
        `
    }

    getVariables() {
        var item;
        item = this.props.item;
        return {
            name: item.name,
            purchasePriceCents: item.purchase_price,
            salePriceCents: item.sale_price,
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on Item {
                id,
                name,
                purchase_price_cents,
                sale_price_cents
            }
        `
    }

    getConfigs() {
        return [];
    }
}

export default NewItem;
