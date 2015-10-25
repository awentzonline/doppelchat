import Dispatcher from 'dispatchers/DoppelDispatcher';

import config from 'config';
import ImageClassifier from 'sources/ImageClassifier';
import PeerData from 'sources/PeerData';

export default class PeerActions {
  // Client-initiated actions ////////////////////////////////
  static connectPeerServer(options) {
    PeerData.start(options);
  }
  static disconnectPeerServer(options) {
    // TODO: If I made a car, the first version would have no brakes.
  }
  static connectToPeer(peerId) {
    //console.log(`Connecting to peer ${peerId}`);
    PeerData.connectToPeer(peerId);
  }
  static makeCall(peerId, stream) {
    //console.log(`Calling ${peerId}`);
    PeerData.callPeer(peerId, stream);
  }
  static endCall(peerId) {
    PeerData.endCall(peerId);
  }
  static callEveryone(stream) {
    PeerData.callEveryone(stream);
  }
  static broadcast(type, data) {
    //console.log(`Broadcasting ${type} ${data}`);
    PeerData.broadcast(type, data);
  }
  static updateUserImage(imageCanvas) {
    let featureVector = ImageClassifier.classify(imageCanvas);
    // console.log(ImageClassifier.getCifar10Labels(featureVector));
    this.updateUserImageFromURL(imageCanvas.toDataURL(), featureVector);
  }
  static updateUserImageFromURL(imageUrl, features) {
    features = Array.from(features);  // important
    const imageInfo = {
      image: imageUrl,
      featureVector: features
    };
    PeerData.broadcast('updateUserImage', imageInfo);
  }
};
