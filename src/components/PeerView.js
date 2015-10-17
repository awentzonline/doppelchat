import React from 'react';

import {Checkbox, Paper} from 'material-ui';

import PeerActions from 'actions/PeerActions';
import CallView from 'components/CallView';
import VideoStream from 'components/VideoStream';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';
import ConnectionStore from 'stores/ConnectionStore';
import UserMediaStore from 'stores/UserMediaStore';


class PeerView extends React.Component {
  constructor() {
    super();
    this.state = {
      call: null
    };
  }
  componentDidMount() {
    ConnectionStore.addListener('callsChange', this._onChange.bind(this));
    PeerActions.makeCall(this.props.peerId, UserMediaStore.stream);
  }
  componentWillUnmount() {
    ConnectionStore.removeListener('callsChange', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      call: ConnectionStore.getCall(this.props.peerId)
    });
  }
  render() {
    var peerId = this.props.peerId;
    return (
      <div className="peerView">
        {{ peerId }}
      </div>
    );
  }
}

PeerView.defaultProps = {
  peerId: null
};

export default PeerView;
