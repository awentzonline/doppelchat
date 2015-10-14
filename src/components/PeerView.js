import React from 'react';

import VideoStream from 'components/VideoStream';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';


class PeerViewComponent extends React.Component {
  constructor() {
    super();
  }
  render() {
    var call = this.props.peerCall;
    if (call.open) {
      return (
        <div className="peerView">
          <VideoStream stream={call.remoteStream}
              muted={this.props.muted}
              width={125} height={125} />
        </div>
      );
    } else {
      return (
        <div className="peerView">
          {call.peer}
        </div>
      );
    }
  }
}

PeerViewComponent.defaultProps = {
  peerCall: null
};

export default PeerViewComponent;
