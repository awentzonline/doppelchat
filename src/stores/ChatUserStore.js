import {EventEmitter} from 'events';
import config from 'config';
import PeerData from 'sources/PeerData';
import DoppelDispatcher from 'dispatchers/DoppelDispatcher';
import questionMark from '../images/qmark.png';

const CHANGE_EVENT = 'change';

class ChatUserStore extends EventEmitter {
  constructor() {
    super();
    this.users = {};
    // We use this canvas to regenerate incoming images to try and reduce shit inputs.
    this._sanitationCanvas = document.createElement('canvas');
    this._sanitationCanvas.width = config.user.image.width;
    this._sanitationCanvas.height = config.user.image.height;
    this._sanitationContext = this._sanitationCanvas.getContext('2d');
    this._sanitationImg = document.createElement('img');
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
    const {peerId} = message;
    let {image, featureVector} = message.data;
    featureVector = this.sanitizeProfileFeatureVector(featureVector);
    image = this.sanitizeProfileImage(image);
    if (image && featureVector) {
      this.users[peerId] = {
        peerId: peerId,
        image: image,
        featureVector: featureVector
      };
      this.emit(CHANGE_EVENT);
    }
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
        featureVector: [0,0,0,0,0,0,0,0,0,0],
        anonymous: true
      };
    }
    return profile;
  }
  getLocalProfile() {
    return this.getProfile(PeerData.peer.id);
  }
  getDistanceToLocal(otherFeatures) {
    var profile = this.getLocalProfile();
    return Math.sqrt(distance2To(otherFeatures, profile.featureVector));
  }
  sanitizeProfileImage(imageSrc) {
    // TODO: I'm not really sure of the best practices for this.
    // Ensure it's data, not script or an external url:
    if (imageSrc.indexOf('data:') != 0) {
      return null;
    }
    this._sanitationImg.src = imageSrc;
    // Enforce consistent dimensions:
    this._sanitationContext.drawImage(
      this._sanitationImg, 0, 0,
      this._sanitationCanvas.width, this._sanitationCanvas.height
    );
    return this._sanitationCanvas.toDataURL();
  }
  sanitizeProfileFeatureVector(v) {
    let a = Array.from(v);
    if (!a.length === config.user.features.dims) {
      return null;
    }
    let containsBadEntry = a.map((val) => {
      return isNaN(val);
    }).reduce((acc, val) => {
      return acc || val;
    }, false);
    if (containsBadEntry) {
      return null;
    }
    a = normalize(a);
    return a;
  }
}

function normalize(a) {
  let b = Array.from(a);
  let d = vectorLength(a);
  for (let i = 0, n = a.length; i < n; i++) {
    b[i] = a[i] / d;
  }
  return b;
}

function vectorLength(a) {
  let d = 0.0;
  let di = 0;
  for (let i = 0, n = a.length; i < n; i++) {
    di = a[i];
    d += di * di;
  }
  return Math.sqrt(d);
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
