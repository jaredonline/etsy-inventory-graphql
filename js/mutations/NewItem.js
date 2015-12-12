import Relay from 'react-relay';

class NewItem extends Relay.Mutation {
    getMutation() {
        return Relay.QL` mutation { newItem  } `
    }

    getVariables() {
        var item;
        item = this.props.item;
        return {
            name: item.name,
            purchasePriceCents: item.purchase_price,
            salePriceCents: item.sale_price,
            shippingProfileId: item.shipping_profile,
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on NewItemPayload {
                me {
                    items(first: 20) {
                        edges {
                            node
                        }
                    }
                }
            }
        `
    }

    getConfigs() {
        return [
            {
                type: "RANGE_ADD",
                parentName: "me",
                parentID: "VXNlcjox",
                connectionName: "items",
                edgeName: "edge",
                rangeBehaviors: {
                    '': 'append',
                },
            }
        ];
    }

    static fragments = {
        item: () => Relay.QL`
            fragment on Item {
                raw_id,
                id,
                purchase_price_cents,
                sale_price_cents,
            }
        `,

    };
}

export default NewItem;
