import React from 'react';
import {Dialog, FlatButton, Paper} from 'material-ui';

import PeerActions from 'peers/PeerActions';
import UserMediaActions from 'actions/UserMediaActions';
import UserVideoStream from 'components/UserVideoStream';
import UserMediaStore from 'stores/UserMediaStore';

import config from 'config';

class CameraDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      userStream: null
    };
  }
  componentDidMount() {
    UserMediaStore.addListener('change', this._userStreamChanged.bind(this));
    this.refs.startupDialog.show();
  }
  componentWillUnmount() {
    UserMediaStore.removeListener('change', this._userStreamChanged.bind(this));
  }
  _acquireUserStream(event) {
    UserMediaActions.acquireUserStream();
  }
  _userStreamChanged() {
    this.setState({
      userStream: UserMediaStore.stream
    });
    this._connectToServer();
  }
  render() {
    return (
      var errorMessage = UserMediaStore.error ? <p>Problem acquiring your camera</p> : '';
      return (
        <Dialog
          ref="startupDialog"
          title="Connect your camera to get started"
          modal={true}>
          {errorMessage}
          <FlatButton label="Connect"
              onClick={this._acquireUserStream.bind(this)} />
        </Dialog>
      );
    }
  }
}
