import config from 'config';
import PeerActions from 'peers/PeerActions';
import ChatStore from 'stores/ChatStore';
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
  static chatCatchupToPeer(toPeer, chat) {
    PeerActions.sendMessageToPeer(toPeer, 'chat', {
      body: chat.body,
      image: chat.image,
      featureVector: chat.featureVector,
      catchup: true
    });
  }
  static sendRecentChats(toPeer) {
    const localPeerId = ChatUserStore.getLocalPeerId();
    const recentChats = ChatStore.getRecentChats(localPeerId);
    // trickle them out
    if (recentChats.length) {
      trickleChat(recentChats);
    }
    function trickleChat(remainingChats) {
      const chat = remainingChats.pop();
      ChatActions.chatCatchupToPeer(toPeer, chat);
      if (remainingChats.length > 0) {
        setTimeout(() => {
          trickleChat(remainingChats);
        }, config.chat.delay + 20);
      }
    }

  }
}
