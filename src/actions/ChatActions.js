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
  static chatToPeer(message, toPeer) {
    const profile = ChatUserStore.getLocalProfile();
    const featureVector = Array.from(profile.featureVector);
    PeerActions.sendMessageToPeer(toPeer, 'chat', {
      body: message,
      image: profile.image,
      featureVector: featureVector
    });
  }
  static chatToPeerFromChat(toPeer, chat) {
    PeerActions.sendMessageToPeer(toPeer, 'chat', {
      body: chat.body,
      image: chat.image,
      featureVector: chat.featureVector
    });
  }
  static sendRecentChats(toPeer) {
    const localPeerId = ChatUserStore.getLocalPeerId();
    const recentChats = ChatStore.getRecentChats(localPeerId);
    // trickle them out
    function trickleChat(remainingChats) {
      const chat = remainingChats.unshift();
      ChatActions.chatToPeerFromChat(toPeer, chat);
      if (remainingChats) {
        setTimeout(() => {
          trickleChat(remainingChats);
        }, config.chat.delay + 20);
      }
    }
  }
}
