import Dispatcher from '../dispatchers/DoppelDispatcher';
import UserMediaStore from 'stores/UserMediaStore';


export default class PeerActions {
  static connectTo(peerId) {
    //console.log(`Connecting to ${peerId}`);
    Dispatcher.dispatch({
      action: 'connectToPeer',
      data: peerId
    });
  }
  static makeCall(peerId) {
    //console.log(`Connecting to ${peerId}`);
    Dispatcher.dispatch({
      action: 'callPeer',
      data: {
        peerId: peerId,
        stream: UserMediaStore.stream
      }
    });
  }
  static broadcast(msg) {
    Dispatcher.dispatch({
      action: 'broadcast',
      data: msg
    });
  }
}
