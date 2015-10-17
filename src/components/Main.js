require('normalize.css');
require('flexboxgrid');
require('styles/App.css');

import React from 'react';
import {Dialog, FlatButton, Paper} from 'material-ui';

import PeerActions from 'actions/PeerActions';
import AddPeer from 'components/AddPeer';
import CallList from 'components/CallList';
import ChatInput from 'components/ChatInput';
import ChatList from 'components/ChatList';
import P2PStatus from 'components/P2PStatus';
import PeerList from 'components/PeerList';
import UserVideoStream from 'components/UserVideoStream';

import UserMediaStore from 'stores/UserMediaStore';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';

import config from 'config';


class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      userStream: null
    };
  }
  componentDidMount() {
    PeerActions.connectPeerServer({
      key: config.peerServer.key,
      host: config.peerServer.host,
      port: config.peerServer.port,
      path: config.peerServer.path
    });
    // this.refs.startupDialog.show();
  }
  render() {
    return (
      <div className="container-fluid layout">
        <div className="row localUserContainer">
          <div className="col-md-3 col-xs-3">
            <Paper zDepth={3}>
              <P2PStatus />
            </Paper>
            <Paper zDepth={3}>
              <UserVideoStream />
            </Paper>
            <PeerList />
          </div>
          <div className="col-md col-xs">
            <CallList />
            <h3>Chats</h3>
            <ChatInput />
            <ChatList />
          </div>
        </div>

        <Dialog
          ref="startupDialog"
          title="Dialog With Custom Actions"
          modal={true}>
          The actions in this window were passed in as an array of react objects.
        </Dialog>

      </div>
    );
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

AppComponent.defaultProps = {
};

export default AppComponent;
