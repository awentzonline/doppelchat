import {EventEmitter} from 'events';
import Peer from 'peerjs';

import PeerActions from 'actions/PeerActions';
import UserMediaStore from 'stores/UserMediaStore';
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
  connectToPeer(peerId) {
    if (this.dataConnections[peerId] === undefined && peerId != this.peer.id) {
      //console.log(`connectToPeer: ${peerId}`);
      var connection = this.peer.connect(peerId);
      this._handleNewConnection(connection);
    }
  }
  callPeer(peerId, stream) {
    if (stream) {
      var call = this.peer.call(peerId, stream);
      this._handleNewCall(call);
    }
  }
  endCall(peerId) {
    var call = this.calls[peerId];
    if (call) {
      call.close();
    }
  }
  broadcast(msgType, data) {
    var packet = [msgType, data];
    // dispatch the message locally as though it were any other p2p message
    this._onIncomingPeerMessage(this.peer.id, packet, null);
    // broadcast to peers
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
    call.on('stream', (stream) => {
      PeerActions.callStarted(peerId);
    });
    call.on('close', () => {
      delete this.calls[peerId];
      PeerActions.callRemoved(peerId);
    });
    call.on('error', (err) => {
      console.log(`Call ${peerId} error: ${err}`);
    });
    PeerActions.callAdded(call);
  }
  // dataConnection
  _handleNewConnection(dataConnection) {
    // add some event handlers to new connections
    var peerId = dataConnection.peer;
    this.dataConnections[peerId] = dataConnection;
    dataConnection.on('data', (data) => {
      var type, payload = data;
      var dataConnection = this.dataConnections[peerId];
      this._onIncomingPeerMessage(peerId, data, dataConnection);
    });
    dataConnection.on('open', () => {
      console.log(`${peerId} opened`);
      PeerActions.connectionAdded(this.dataConnections[peerId]);
    });
    dataConnection.on('close', () => {
      console.log(peerId + ' closed');
      delete this.dataConnections[peerId];
      PeerActions.connectionRemoved(peerId)
    });
    dataConnection.on('error', (err) => {
      console.log(`${peerId} error: ${err}`);
      // TODO: Does this kill the connnection?
      // delete this.dataConnections[peerId];
      // this.emit(Events.CALLS_CHANGE_EVENT);
    });
  }
  _onIncomingPeerMessage(peerId, data, dataConnection) {
    PeerActions.peerMsg(peerId, data, dataConnection);
  }
}

const peers = new PeerManager();

export default peers;
