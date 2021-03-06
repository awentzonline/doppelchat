require('normalize.css');
require('flexboxgrid');
require('styles/App.css');

import React from 'react';
import {Dialog, FlatButton, Paper} from 'material-ui';

import PeerActions from 'peers/PeerActions';
import UserMediaActions from 'actions/UserMediaActions';
import AddPeer from 'components/AddPeer';
import CallList from 'components/CallList';
import ChatInput from 'components/ChatInput';
import ChatList from 'components/ChatList';
import ImageInput from 'components/ImageInput';
import P2PStatus from 'components/P2PStatus';
import PeerImageList from 'components/PeerImageList';
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
          <div className="col-xs-2 navContainer">
            <Paper zDepth={5}>
              <div className="row center-xs">
                <div className="col-xs">
                  <p>
                    DoppelChat
                  </p>
                  <div className="row center-xs">
                    <div className="col-xs-6 center-xs">
                      <a className="twitterLink twitter-share-button" href="https://twitter.com/share"
                          data-url="http://doppelchat.com"
                          data-text="DoppelChat: P2P chat clustered by images"
                          data-via="awentzonline" data-count="none">
                        Tweet
                      </a>
                    </div>
                    <div className="col-xs-6 center-xs">
                      <div className="fb-share-button" data-href="http://doppelchat.com" data-layout="button"></div>
                    </div>
                  </div>
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
              <PeerImageList />
            </Paper>
          </div>
          <div className="col-xs">
            <p className="end-xs instructions">Become any image by clicking it</p>
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
