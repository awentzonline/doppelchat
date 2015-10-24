import Dispatcher from 'dispatchers/DoppelDispatcher';

import config from 'config';
import ImageClassifier from 'sources/ImageClassifier';
import PeerData from 'sources/PeerData';


export default class PeerActions {
  // Client-initiated actions ////////////////////////////////
  static connectPeerServer(options) {
    PeerData.start(options);
  }
  static disconnectPeerServer(options) {
    // TODO: If I made a car, the first version would have no brakes.
  }
  static connectToPeer(peerId) {
    //console.log(`Connecting to peer ${peerId}`);
    PeerData.connectToPeer(peerId);
  }
  static makeCall(peerId, stream) {
    //console.log(`Calling ${peerId}`);
    PeerData.callPeer(peerId, stream);
  }
  static endCall(peerId) {
    PeerData.endCall(peerId);
  }
  static callEveryone(stream) {
    PeerData.callEveryone(stream);
  }
  static broadcast(type, data) {
    //console.log(`Broadcasting ${type} ${data}`);
    PeerData.broadcast(type, data);
  }
  static updateUserImage(imageCanvas) {
    const featureVector = ImageClassifier.classify(imageCanvas);
    // console.log(ImageClassifier.getCifar10Labels(featureVector));
    this.updateUserImageFromURL(imageCanvas.toDataURL(), featureVector);
  }
  static updateUserImageFromURL(imageUrl, features) {
    const imageInfo = {
      image: imageUrl,
      featureVector: features
    };
    PeerData.broadcast('updateUserImage', imageInfo);
  }
  // Peer-initiated actions ////////////////////////////////
  static connectedToPeerServer() {
     dispatch('peerServerConnected', {});
  }
  static disconnectedFromPeerServer() {
     dispatch('peerServerDisconnected', {});
  }
  static connectionAdded(connection) {
     dispatch('connectionAdded', {
       connection: connection
     });
  }
  static connectionRemoved(peerId) {
     dispatch('connectionRemoved', {
       peerId: peerId
     });
  }
  static callAdded(call) {
     dispatch('callAdded', {
       call: call
     });
  }
  static callStarted(call) {
    dispatch('callStarted', {
      call: call
    });
  }
  static callRemoved(peerId) {
     dispatch('callRemoved', {
       peerId: peerId
     });
  }
  // incoming p2p data
  static peerMsg(peerId, message, connection) {
    const [type, data] = message;
    dispatch('peerMsg', {
      peerId: peerId,
      type: type,
      data: data,
      connection: connection
    });
  }
}
// utils
function dispatch(action, data) {
  Dispatcher.dispatch({
    action: action,
    data: data
  });
}
