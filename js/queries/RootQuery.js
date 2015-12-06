import Relay from 'react-relay'


export default {
    me: () => Relay.QL` query { me } `
};
