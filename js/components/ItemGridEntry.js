import React from 'react';
import Relay from 'react-relay';

class ItemTable extends React.Component {
    render() {
        var imageSrc = "/images/" + this.props.item.raw_id % 10 + ".jpg";
        var url = "#item/" + this.props.item.raw_id;
        return(
            <div className="card">
                <a href={url}>
                    <img className="card-img" src={imageSrc} style={{width: "100%"}} />
                    <div className="card-img-overlay">
                        <h4 className="card-title">{this.props.item.name}</h4>
                    </div>
                </a>
            </div>
        );
    }
}

export default Relay.createContainer(ItemTable, {
    fragments: {
        item: () => Relay.QL`
            fragment on Item {
                name
                raw_id
                sale_price_cents
                purchase_price_cents
                potential_profit_cents
            }
        `,
    },
});
