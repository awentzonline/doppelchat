import React from 'react';
import {Paper} from 'material-ui';

import PeerView from 'components/PeerView';
import ConnectionStore from 'stores/ConnectionStore';

class PeerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peerIds: ConnectionStore.getPeerIds()
    };
  }
  componentDidMount() {
    ConnectionStore.addListener('peersChange', this._onChange.bind(this));
  }
  componentWillUnmount() {
    ConnectionStore.removeListener('peersChange', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      peerIds: ConnectionStore.getPeerIds()
    });
  }
  render() {
    var peerItems = this.state.peerIds.map(renderPeerItem);
    return (
      <div className="peerList col-xs">
        {peerItems}
      </div>
    );
  }
}

function renderPeerItem(peerId) {
  return (
    <div className="row">
      <Paper zDepth={3}>
        <div clasName="col-xs">
          <PeerView peerId={peerId} />
        </div>
      </Paper>
    </div>
  );
}

export default PeerList;
