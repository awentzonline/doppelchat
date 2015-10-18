import Dispatcher from 'dispatchers/DoppelDispatcher';
import PeerActions from 'actions/PeerActions';


export default class ChatActions {

  static broadcastChat(message) {
    PeerActions.broadcast('chat', {
      body: message
    });
  }
}
