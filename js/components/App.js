import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Item list</h1>
        <p>{this.props.me.email}</p>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        email
      }
    `,
  },
});
