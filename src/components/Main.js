require('normalize.css');
require('styles/App.css');

import React from 'react';

import AddPeer from 'components/AddPeer';
import P2PStatus from 'components/P2PStatus';
import PeerList from 'components/PeerList';
import VideoStream from 'components/VideoStream';

import UserMediaStore from 'stores/UserMediaStore';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';


class AppComponent extends React.Component {
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
    return (
      <div className="appContainers">
        <div className="userStream">
          <VideoStream stream={this.state.userStream} muted={true}
              width={125} height={125} />
          <button onClick={this._acquireUserStream}>Start</button>
        </div>
        <P2PStatus />
        <AddPeer />
        <PeerList />
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
