import React from 'react';
import {Checkbox, Paper} from 'material-ui';

import PeerActions from 'actions/PeerActions';
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
        featureVector: [0,0,0,0,0,0,0,0,0,0]
      }
    };
  }
  componentDidMount() {
    // HACK: just kick off a call automatically
    PeerActions.makeCall(this.props.peerId, UserMediaStore.stream);
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
  render() {
    const peerId = this.props.peerId;
    return (
      <div className="peerView">
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
