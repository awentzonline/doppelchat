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
      <div className="peerList row">
        {peerItems}
      </div>
    );
  }
}

function renderPeerItem(peerId) {
  return (
    <div className="col-xs">
      <Paper zDepth={3}>
        <PeerView peerId={peerId} />
      </Paper>
    </div>
  );
}

export default PeerList;
