require('normalize.css');
require('flexboxgrid');
require('styles/App.css');

import React from 'react';
import {Dialog, FlatButton, Paper} from 'material-ui';

import PeerActions from 'actions/PeerActions';
import UserMediaActions from 'actions/UserMediaActions';
import AddPeer from 'components/AddPeer';
import CallList from 'components/CallList';
import ChatInput from 'components/ChatInput';
import ChatMain from 'components/ChatMain';
import ChatList from 'components/ChatList';
import P2PStatus from 'components/P2PStatus';
import PeerList from 'components/PeerList';
import UserVideoStream from 'components/UserVideoStream';
import UserMediaStore from 'stores/UserMediaStore';

import config from 'config';

class AppComponent extends React.Component {
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
  _connectToServer() {
    PeerActions.connectPeerServer({
      key: config.peerServer.key,
      host: config.peerServer.host,
      port: config.peerServer.port,
      path: config.peerServer.path
    });
  }
  render() {
    if (this.state.userStream) {
      return (
        <ChatMain />
      );
    } else {
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

AppComponent.defaultProps = {
};

export default AppComponent;
