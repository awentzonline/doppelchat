import React from 'react';
import {FlatButton, Paper} from 'material-ui';

import PeerActions from 'peers/PeerActions';
import VideoStream from 'components/VideoStream';

class CallViewComponent extends React.Component {
  constructor() {
    super();
  }
  _onEndCall() {
    PeerActions.endCall(this.props.peerCall.peer);
  }
  render() {
    var call = this.props.peerCall;
    if (call && call.open) {
      return (
        <div className="callView col-xs">
          <VideoStream stream={call.remoteStream}
              muted={this.props.muted}
              width="100%" height="100%" />
          <div className="end-xs">
            <FlatButton label="Close"
              onClick={this._onEndCall.bind(this)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="callView">
          No stream
        </div>
      );
    }
  }
}

CallViewComponent.defaultProps = {
  peerCall: null,
  muted: true
};

export default CallViewComponent;
