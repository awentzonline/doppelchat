import {EventEmitter} from 'events';
import Peer from 'peerjs';
import UserMediaStore from 'stores/UserMediaStore';
import PeerActions from 'actions/PeerActions';
import config from 'config';

const Events = {
  CHANGE_EVENT: 'change',
  CALLS_CHANGE_EVENT: 'callsChange',
  PEERS_CHANGE_EVENT: 'peersChange',
  PEER_MESSAGE: 'peerMsg'
};

class PeerManager extends EventEmitter {
  constructor() {
    super();
    this.Events = Events;
    this.calls = {};
    this.dataConnections = {};
    this.connected = false;
    this.peer = null;
  }
  start(options_) {
    var options = options_ || {};
    var iceServers = options.iceServers || [
      {url: 'stun://stun.l.google.com:19302'},
      {url: 'stun://stun1.l.google.com:19302'},
      {url: 'stun://stun2.l.google.com:19302'},
      {url: 'stun://stun3.l.google.com:19302'},
      {url: 'stun://stun4.l.google.com:19302'}
    ];
    var peerOptions = {
      host: options.host || '0.peerjs.com',
      port: options.port || 80,
      path: options.path || '/',
      config: {
        iceServers: iceServers
      }
    };
    if (options.key) {
      peerOptions.key = options.key;
    }
    this.peer = new Peer(peerOptions);
    this.peer.on('open', (id) => {
      // console.log('Your peer ID is: ' + id);
      this.connected = true;
      PeerActions.connectedToPeerServer();
      // Just connect to everyone on the server:
      this.peer.listAllPeers((peerIds) => {
        if (peerIds) {
          peerIds.forEach((peerId) => {
            this.connectToPeer(peerId);
          });
        }
      });
    });
    this.peer.on('connection', this._handleNewConnection.bind(this));
    this.peer.on('error', (err) => {
      //console.log('Peer error: ' + err);
      this.connected = false;
      this.emit(Events.CHANGE_EVENT);
    });
    this.peer.on('call', (call) => {
      this._handleNewCall(call);
      call.answer(UserMediaStore.stream);
      this.emit(Events.CALLS_CHANGE_EVENT);
    });
    return this.peer;
  }
  callPeer(peerId, stream) {
    if (stream) {
      var call = this.peer.call(peerId, stream);
      this._handleNewCall(call);
    }
  }
  connectToPeer(peerId) {
    if (this.dataConnections[peerId] === undefined && peerId != this.peer.id) {
      console.log(`connectToPeer: ${peerId}`);
      var connection = this.peer.connect(peerId);
      this._handleNewConnection(connection);
    }
  }
  broadcast(msgType, data) {
    var packet = [msgType, data];
    this._onIncomingPeerMessage(packet, this.peer.id, null);
    Object.keys(this.dataConnections).forEach((name) => {
      var connection = this.dataConnections[name];
      connection.send(packet);
    });
  }
  sendMessageToPeer(peerId, msgType, msg) {
    var packet = [msgType, msg];
    var connection = this.dataConnections[peerId];
    if (connection) {
      connection.send(packet);
    }
  }
  sendPeerListTo(peerId) {
    // send a list of everyone but the target peer
    var connection = this.dataConnections[peerId];
    if (!connection) {
      return;
    }
    var peerIds = Object.keys(this.dataConnections);
    this.sendMessageToPeer(peerId, 'peers4u', peerIds);
  }
  // mediaConnections
  _handleNewCall(call) {
    // add some event handlers to new connections
    var peerId = call.peer;
    this.calls[peerId] = call;
    call.on('stream', this._onCallStream.bind(this, peerId));
    call.on('close', this._onCallClose.bind(this, peerId));
    call.on('error', this._onCallError.bind(this, peerId));
    PeerActions.callAdded(call);
  }
  _onCallStream(peerId) {
    PeerActions.callStarted(peerId);
  }
  _onCallClose(peerId) {
    delete this.calls[peerId];
    PeerActions.callRemoved(peerId);
  }
  _onCallError(peerId, err) {
    console.log(`Call ${peerId} error: ${err}`);
  }
  // dataConnection
  _handleNewConnection(dataConnection) {
    // add some event handlers to new connections
    var peerId = dataConnection.peer;
    this.dataConnections[peerId] = dataConnection;
    dataConnection.on('data', this._onConnectionData.bind(this, peerId));
    dataConnection.on('open', this._onConnectionOpen.bind(this, peerId));
    dataConnection.on('close', this._onConnectionClose.bind(this, peerId));
    dataConnection.on('error', this._onConnectionError.bind(this, peerId));
  }
  _onConnectionData(peerId, data) {
    var type, payload = data;
    switch (type) {
      case 'peers4u':
        var peerList = payload;
        peerList.forEach((pid) => {
          if (this.dataConnections[pid] === undefined) {
            this.connectToPeer(pid);
          }
        });
        break;
      default:
        var dataConnection = this.dataConnections[peerId];
        this._onIncomingPeerMessage(data, peerId, dataConnection);
        break;
    }
  }
  _onIncomingPeerMessage(message, peerId, dataConnection) {
    this.emit(Events.PEER_MESSAGE, peerId, message);
  }
  _onConnectionOpen(peerId) {
    console.log(`${peerId} opened`);
    PeerActions.connectionAdded(this.dataConnections[peerId]);
  }
  _onConnectionClose(peerId) {
    console.log(peerId + ' closed');
    delete this.dataConnections[peerId];
    PeerActions.connectionRemoved(peerId)
  }
  _onConnectionError(peerId, err) {
    console.log(`${peerId} error: ${err}`);
    // TODO: Does this kill the connnection?
    // delete this.dataConnections[peerId];
    // this.emit(Events.CALLS_CHANGE_EVENT);
  }

  // Moved to ConnectionStore?
  getPeerList() {
    var ids = Object.keys(this.dataConnections) || [];
    ids.sort();
    return ids.map((id) => {
      return {id: id}
    });
  }
  getPeerIds() {
    var ids = Object.keys(this.dataConnections) || [];
    ids.sort();
    return ids;
  }
  getDataConnections() {
    var ids = Object.keys(this.dataConnections) || [];
    ids.sort();
    return ids.map((id) => {
      return this.dataConnections[id];
    });
  }
  getCallList() {
    var ids = Object.keys(this.calls) || [];
    ids.sort();
    return ids.map((id) => {
      return this.calls[id];
    });
  }
}

const peers = new PeerManager();

export default peers;
