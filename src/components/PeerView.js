import React from 'react';
import {Checkbox, Paper} from 'material-ui';

import PeerActions from 'peers/PeerActions';
import CallView from 'components/CallView';
import VideoStream from 'components/VideoStream';
import ChatUserStore from 'stores/ChatUserStore';
import UserMediaStore from 'stores/UserMediaStore';
import questionMark from '../images/qmark.png';

class PeerView extends React.Component {
  constructor() {
    super();
    this.state = {
      profile: {
        image: questionMark,
        featureVector: [0,0,0,0,0,0,0,0,0,0],
        anonymous: true
      }
    };
  }
  componentDidMount() {
    // HACK: just kick off a call automatically
    // PeerActions.makeCall(this.props.peerId, UserMediaStore.stream);
    this._onUserChange = this.onUserChange.bind(this);
    ChatUserStore.addListener('change', this._onUserChange);
  }
  componentWillUnmount() {
    ChatUserStore.removeListener('change', this._onUserChange);
  }
  onUserChange() {
    this.setState({
      profile: ChatUserStore.getProfile(this.props.peerId)
    });
  }
  onAssumeFeatures() {
    const profile = ChatUserStore.getProfile(this.props.peerId);
    if (!profile.anonymous) {
      PeerActions.updateUserImageFromURL(profile.image, profile.featureVector);
    }
  }
  render() {
    const peerId = this.props.peerId;
    return (
      <div className="peerView" onClick={this.onAssumeFeatures.bind(this)}>
        <img className="userImage"
            src={this.state.profile.image} />
      </div>
    );
  }
}

PeerView.defaultProps = {
  peerId: null
};

export default PeerView;
