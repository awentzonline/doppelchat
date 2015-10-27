import Dispatcher from 'dispatchers/DoppelDispatcher';

import config from 'config';
import ImageClassifier from 'sources/ImageClassifier';
import ChatUserStore from 'stores/ChatUserStore';
import PeerActions from 'peers/PeerActions';
import PeerData from 'peers/PeerData';

export default class IncomingPeerActions {
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
     // HACK: just want to get this going
     const profile = ChatUserStore.getLocalProfile();
     if (!profile.anonymous) {
       PeerActions.updateUserImageFromURL(
         profile.image, profile.featureVector, connection.peer
       );
     }
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
