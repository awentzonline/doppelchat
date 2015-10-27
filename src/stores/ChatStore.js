import {EventEmitter} from 'events';
import {markdown} from 'markdown';

import config from 'config';
import ChatUserStore from './ChatUserStore';
import DoppelDispatcher from 'dispatchers/DoppelDispatcher';
import RateLimiter from 'stores/RateLimiter';

const CHANGE_EVENT = 'change';

class ChatStore extends EventEmitter {
  constructor() {
    super();
    this.items = [];
  }
  dispatch(payload) {
    switch (payload.action) {
      case 'peerMsg':
        this._handlePeerMessage(payload.data);
        break;
    }
  }
  _handlePeerMessage(message) {
    switch (message.type) {
      case 'chat':
        RateLimiter.attempt(`chatMsg-${message.peerId}`, config.chat.delay, () => {
          this.addChat(message);
        });
        break;
    }
  }
  addChat(message) {
    let {body, image, featureVector} = message.data;
    if (body) {
      body += ''; // strings, baby
      body = body.substr(0, config.chat.body.maxLength)  // cut down on the funny business
      // body = markdown.toHTML(body); // NOTE: maybe later
      // make image good now
      image = ChatUserStore.sanitizeProfileImage(image, (goodImage) => {
        featureVector = ChatUserStore.sanitizeProfileFeatureVector(featureVector);
        if (featureVector) {
          var item = {
            peerId: message.peerId,
            body: body,
            image: goodImage,
            featureVector: featureVector
          }
          this.addItem(item);
        }
      });
    }
  }
  addItem(item) {
    this.items.unshift(item);
    while(this.items.length > config.chat.maxItems) {
      this.items.pop();
    }
    this.emit(CHANGE_EVENT);
  }
  getChatItems() {
    return this.items;
  }
  getRecentChats(peerId) {
    const maxRecent = 10;
    const chatItems = this.getChatItems();
    let result = [];
    for (let i = 0, len = chatItems.length; i < len && result.length < maxRecent; i++) {
      var chat = chatItems[i];
      if (chat.peerId == peerId) {
        result.push(chat);
      }
    }
    return result;
  }
}

var store = new ChatStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
