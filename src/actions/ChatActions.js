import PeerActions from 'actions/PeerActions';
import PeerData from 'sources/PeerData';
import ChatUserStore from 'stores/ChatUserStore';

export default class ChatActions {
  static broadcastChat(message) {
    var profile = ChatUserStore.getProfile(PeerData.peer.id);
    PeerActions.broadcast('chat', {
      body: message,
      image: profile.image
    });
  }
}
