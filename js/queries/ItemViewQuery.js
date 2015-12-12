import Relay from 'react-relay'

export default {
    me: () => Relay.QL`query { me }`,
    payment_connection: () => Relay.QL`query { payment_connection }`
};
