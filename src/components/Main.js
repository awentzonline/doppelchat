require('normalize.css');
require('flexboxgrid');
require('styles/App.css');

import React from 'react';

import {Paper} from 'material-ui';

import AddPeer from 'components/AddPeer';
import P2PStatus from 'components/P2PStatus';
import CallList from 'components/CallList';
import UserVideoStream from 'components/UserVideoStream';

import UserMediaStore from 'stores/UserMediaStore';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';


class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      userStream: null
    };
  }
  render() {
    return (
      <div className="container-fluid layout">
        <div className="row localUserContainer">
          <div className="col-md-3 col-xs-4">
            <Paper zDepth={3}>
              <UserVideoStream />
            </Paper>
            <Paper zDepth={3}>
              <P2PStatus />
            </Paper>
              <Paper zDepth={3}>
              <AddPeer />
            </Paper>
          </div>
          <div className="col-md col-xs">
            <CallList />
          </div>
        </div>
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
