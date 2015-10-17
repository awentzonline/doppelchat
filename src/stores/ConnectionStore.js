import {EventEmitter} from 'events';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';

const Events = {
  CHANGE_EVENT: 'change',
  CALLS_CHANGE_EVENT: 'callsChange',
  PEERS_CHANGE_EVENT: 'peersChange'
};

class ConnectionStore extends EventEmitter {
  constructor() {
    super();
    this.dataConnections = {};
    this.calls = {};
    this.status = 'Not started';
  }
  dispatch(payload) {
    var peerId;
    switch (payload.action) {
      case 'peerServerConnected':
        this.status = 'Connected';
        this.emit(Events.CHANGE_EVENT);
        break;
      case 'peerServerDisconnected':
        this.status = 'Disconnected';
        this.emit(Events.CHANGE_EVENT);
        break;
      case 'connectionAdded':
        var {connection} = payload.data;
        this.dataConnections[connection.peer] = connection;
        this.emit(Events.PEERS_CHANGE_EVENT);
        break;
      case 'connectionRemoved':
        peerId = payload.data.peerId;
        if (this.dataConnections[peerId]) {
          delete this.dataConnections[peerId];
        }
        this.emit(Events.PEERS_CHANGE_EVENT);
        break;
      case 'callAdded':
        var {call} = payload.data;
        this.calls[call.peer] = call;
        this.emit(Events.CALLS_CHANGE_EVENT);
        break;
      case 'callStarted':
        this.emit(Events.CALLS_CHANGE_EVENT);
        break;
      case 'callRemoved':
        peerId = payload.data.peerId;
        if (this.calls[peerId]) {
          delete this.calls[peerId];
        }
        this.emit(Events.CALLS_CHANGE_EVENT);
        break;
    }
  }
  getStatusMessage() {
    return this.status;
  }
  getPeerIds() {
    var ids = Object.keys(this.dataConnections) || [];
    return ids;
  }
  getDataConnection(peerId) {
    return this.dataConnections[peerId];
  }
  getDataConnections() {
    var ids = Object.keys(this.dataConnections) || [];
    ids.sort();
    return ids.map((id) => {
      return this.dataConnections[id];
    });
  }
  // calls
  getCall(peerId) {
    return this.calls[peerId];
  }
  getCallList() {
    var ids = Object.keys(this.calls) || [];
    ids.sort();
    return ids.map((id) => {
      return this.calls[id];
    });
  }
}

var store = new ConnectionStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
