import React from 'react';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

class Nav extends React.Component {
    render() {
        return(
            <header className="navbar navbar-light navbar-static-top ">
                <nav className="nav navbar-nav">
                    <Link className="navbar-brand" to="/">Etsy Inventory</Link>
                    <Link activeClassName="active" className="nav-item nav-link" to="/list">Items</Link>
                    <Link activeClassName="active" className="nav-item nav-link" to="/shipping_profiles">Shipping Profiles</Link>
                    <Link activeClassName="active" className="nav-item nav-link" to="/paymen_providers">Payment Providers</Link>
                </nav>
            </header>
        );
    }
}

export default Relay.createContainer(Nav, {
    fragments: {
    },
});
