import {EventEmitter} from 'events';
import {markdown} from 'markdown';

import config from 'config';
import ChatUserStore from './ChatUserStore';
import DoppelDispatcher from 'dispatchers/DoppelDispatcher';
import RateLimiter from 'stores/RateLimiter';

const CHANGE_EVENT = 'change';
const MAX_NUM_ITEMS = 2000;

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
        let rateKey = `chatMsg-${message.peerId}`;
        if (!RateLimiter.shouldLimit(rateKey, config.chat.delay)) {
          this.addChat(message);
          RateLimiter.used(rateKey);
        }
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
    while(this.items.length > MAX_NUM_ITEMS) {
      this.items.pop();
    }
    this.emit(CHANGE_EVENT);
  }
  getChatItems() {
    return this.items;
  }
}

var store = new ChatStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
