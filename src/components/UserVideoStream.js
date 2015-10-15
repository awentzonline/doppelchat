import React from 'react';

import {Paper, FlatButton} from 'material-ui';
import VideoStream from 'components/VideoStream';

import UserMediaStore from 'stores/UserMediaStore';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';


class UserVideoStream extends React.Component {
  constructor() {
    super();
    this.state = {
      userStream: null
    };
  }
  _userStreamChanged() {
    this.setState({
      userStream: UserMediaStore.stream
    });
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
        <div className="userVideoStream col-xs xs-center">
          <FlatButton label="Start Camera"
              onClick={this._acquireUserStream}
              />
        </div>
      );
    }
  }
  _acquireUserStream(event) {
    DoppelDispatcher.dispatch({
      action: 'acquireUserStream',
      data: {
        video: true,
        audio: true
      }
    });
  }
}

UserVideoStream.defaultProps = {
};

export default UserVideoStream;
