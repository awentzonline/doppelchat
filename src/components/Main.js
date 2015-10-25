require('normalize.css');
require('flexboxgrid');
require('styles/App.css');

import React from 'react';
import {Dialog, FlatButton, Paper} from 'material-ui';

import PeerActions from 'peers/PeerActions';
import ChatMain from 'components/ChatMain';
import config from 'config';

class AppComponent extends React.Component {
  componentDidMount() {
    PeerActions.connectPeerServer({
      key: config.peerServer.key,
      host: config.peerServer.host,
      port: config.peerServer.port,
      path: config.peerServer.path
    });
  }
  componentWillUnmount() {
    PeerActions.disconnectFromPeerServer();
  }
  render() {
    return (
      <ChatMain />
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
