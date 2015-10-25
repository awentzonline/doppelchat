import React from 'react';
import {Checkbox, Paper} from 'material-ui';

import PeerActions from 'peers/PeerActions';
import CallView from 'components/CallView';
import VideoStream from 'components/VideoStream';
import ChatUserStore from 'stores/ChatUserStore';
import UserMediaStore from 'stores/UserMediaStore';
import questionMark from '../images/qmark.png';

class PeerImage extends React.Component {
  constructor() {
    super();
  }
  onAssumeFeatures() {
    PeerActions.updateUserImageFromURL(this.props.image, this.props.featureVector);
  }
  render() {
    return (
      <div className="peerView" onClick={this.onAssumeFeatures.bind(this)}>
        <img className="userImage"
            src={this.props.image} />
      </div>
    );
  }
}

PeerImage.defaultProps = {
  imageKey: null,
  image: null,
  featureVector: null
};

export default PeerImage;
