import PeerActions from 'peers/PeerActions';
import ChatUserStore from 'stores/ChatUserStore';

export default class ChatActions {
  static broadcastChat(message) {
    const profile = ChatUserStore.getLocalProfile();
    const featureVector = Array.from(profile.featureVector);
    PeerActions.broadcast('chat', {
      body: message,
      image: profile.image,
      featureVector: featureVector
    });
  }
}
