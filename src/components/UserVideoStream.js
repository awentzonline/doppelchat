import React from 'react';
import {Paper, FlatButton} from 'material-ui';

import PeerActions from 'actions/PeerActions';
import UserMediaActions from 'actions/UserMediaActions';
import VideoStream from 'components/VideoStream';
import UserMediaStore from 'stores/UserMediaStore';

class UserVideoStream extends React.Component {
  constructor() {
    super();
    this.state = {
      userStream: UserMediaStore.stream
    };
  }
  _userStreamChanged() {
    var stream = UserMediaStore.stream;
    this.setState({
      userStream: stream
    });
    if (stream) {
      PeerActions.callEveryone(stream);
    }
  }
  componentDidMount() {
    UserMediaStore.addListener('change', this._userStreamChanged.bind(this));
  }
  componentWillUnmount() {
    UserMediaStore.removeListener('change', this._userStreamChanged.bind(this));
  }
  render() {
    if (this.state.userStream) {
      return (
        <div className="userVideoStream">
          <VideoStream stream={this.state.userStream}
              muted={true} width="100%" height="100%"
              />
        </div>
      );
    } else {
      return (
        <div className="userVideoStream col-xs center-xs">
          <FlatButton label="Camera"
              onClick={this._acquireUserStream}
              />
        </div>
      );
    }
  }
  _acquireUserStream(event) {
    UserMediaActions.acquireUserStream();
  }
}

UserVideoStream.defaultProps = {
};

export default UserVideoStream;
