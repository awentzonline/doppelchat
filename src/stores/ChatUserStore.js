import {EventEmitter} from 'events';
import PeerData from 'sources/PeerData';
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
        image: questionMark,
        featureVector: [0,0,0,0,0,0,0,0,0,0]
      };
    }
    return profile;
  }
  getLocalProfile() {
    return this.getProfile(PeerData.peer.id);
  }
  getDistanceToLocal(otherFeatures) {
    var profile = this.getLocalProfile();
    return distance2To(otherFeatures, profile.featureVector);
  }
}

function distance2To(a, b) {
  let d = 0.0;
  let di = 0;
  for (let i = 0, n = a.length; i < n; i++) {
    di = b[i] - a[i];
    d += di * di;
  }
  return d;
}

var store = new ChatUserStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
