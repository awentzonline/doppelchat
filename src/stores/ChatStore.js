import {EventEmitter} from 'events';
import DoppelDispatcher from 'dispatchers/DoppelDispatcher';

const CHANGE_EVENT = 'change';
const MAX_NUM_ITEMS = 100;

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
        this.addChat(message);
        break;
    }
  }
  addChat(message) {
    var body = message.data.body;
    if (body) {
      body += ''; // strings, baby
      var item = {
        peerId: message.peerId,
        body: body.substr(0, 512)  // cut down on the funny business
      }
      this.addItem(item);
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
