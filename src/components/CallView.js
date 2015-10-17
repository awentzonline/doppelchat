import React from 'react';

import VideoStream from 'components/VideoStream';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';

import {Checkbox, Paper} from 'material-ui';


class CallViewComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      muted: false
    };
  }
  _onMuteChanged(event) {
    var val = event.target.value;
    this.setState({
      muted: val == 'on'
    });
  }
  render() {
    var call = this.props.peerCall;
    if (call && call.open) {
      return (
        <div className="callView">
          <VideoStream stream={call.remoteStream}
              muted={this.props.muted}
              width="100%" height="100%" />
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
  peerCall: null
};

export default CallViewComponent;
