import {EventEmitter} from 'events';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';
import PeerData from 'sources/PeerData';


class PeerStore extends EventEmitter {
  constructor() {
    super();
    this.peers = new PeerData();
    this.peers.start();
    this.peers.addListener('peerMsg', (peerId, message, connection) => {
      // DoppelDispatcher.dispatch({
      //   action: 'peerMsg',
      //   data: {
      //     peerId: peerId,
      //     message: message,
      //     connection: connection
      //   }
      // });
    });
  }
  dispatch(payload) {
    switch (payload.action) {
      case 'broadcast':
        var {type, data} = payload.data;
        //console.log(`broadcast: ${message}`);
        this.peers.broadcast(type, data);
        break;
      case 'connectToPeer':
        var peerId = payload.data;
        console.log(`connectToPeer: ${peerId}`);
        this.peers.connectTo(peerId);
        break;
      case 'callPeer':
        const {peerId, stream} = payload.data;
        console.log(`callPeer: ${peerId} ${stream}`);
        this.peers.callPeer(peerId, stream);
        break;
    }
  }
  makeMessage(type, data) {
    return {
      type: type,
      data: data
    };
  }
  getStatusMessage() {
    return this.peers.status;
  }
  getPeerList() {
    return this.peers.getPeerList();
  }
  getCallList() {
    return this.peers.getCallList();
  }
}

var store = new PeerStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
