import {EventEmitter} from 'events';
import DoppelDispatcher from 'dispatchers/DoppelDispatcher';
import questionMark from '../images/qmark.png';

const CHANGE_EVENT = 'change';

class ChatUserStore extends EventEmitter {
  constructor() {
    super();
    this.localUser = {
      image: null,
      featureVector: null
    };
    this.users = {};
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
      case 'connectionRemoved':
        this.removeUser(message);
        break;
      case 'updateUserImage':
        this.updateUserImage(message);
        break;
    }
  }
  updateUserImage(message) {
    const {image, featureVector} = message.data;
    const {peerId} = message;
    this.users[peerId] = {
      peerId: peerId,
      image: image,
      featureVector: featureVector
    };
    this.emit(CHANGE_EVENT);
  }
  removeUser(message) {
    const {peerId} = message.data;
    delete this.users[peerId];
    this.emit(CHANGE_EVENT);
  }
  getProfile(peerId) {
    let profile = this.users[peerId];
    if (!profile) {
      profile = {
        image: questionMark
      };
    }
    return profile;
  }
}

var store = new ChatUserStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
