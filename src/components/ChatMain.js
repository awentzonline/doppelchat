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
import ChatList from 'components/ChatList';
import ImageInput from 'components/ImageInput';
import P2PStatus from 'components/P2PStatus';
import PeerList from 'components/PeerList';
import PeerView from 'components/PeerView';
import UserVideoStream from 'components/UserVideoStream';
import UserMediaStore from 'stores/UserMediaStore';

import config from 'config';

class ChatMain extends React.Component {
  constructor() {
    super();
    this.state = {
    };
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
    return (
      <div className="container-fluid layout">
        <div className="row localUserContainer">
          <div className="col-md-2 col-xs-2">
            <Paper zDepth={5}>
              <div className="row center-xs">
                <div className="col-xs">
                  <p>DoppelChat</p>
                </div>
              </div>
            </Paper>
            <Paper zDepth={3}>
              <ImageInput
                  cropWidth={config.user.image.width}
                  cropHeight={config.user.image.height}
                />
            </Paper>
            <Paper zDepth={3}>
              <P2PStatus />
              <PeerList />
            </Paper>
          </div>
          <div className="col-md col-xs">
            <CallList />
            <ChatInput />
            <ChatList />
          </div>
        </div>
      </div>
    );
  }
}

ChatMain.defaultProps = {
};

export default ChatMain;
