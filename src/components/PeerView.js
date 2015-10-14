import React from 'react';

import VideoStream from 'components/VideoStream';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';

import {Checkbox, Paper} from 'material-ui';


class PeerViewComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      muted: false
    };
  }
  _onMuteChanged(event) {
    var val = event.target.value;
    console.log(val);
    this.setState({
      muted: val == 'on'
    });
  }
  render() {
    var call = this.props.peerCall;
    if (call.open) {
      return (
        <div className="peerView">
          <VideoStream stream={call.remoteStream}
              muted={this.props.muted}
              width="100%" height="100%" />
          <Checkbox label="Mute"
              value={this.state.muted}
              defaultChecked={this.props.muted}
              onChange={this._onMuteChanged} />
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
