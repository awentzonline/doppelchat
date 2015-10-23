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
    this._onChange = this.onChange.bind(this)
    ConnectionStore.addListener('peersChange', this._onChange);
  }
  componentWillUnmount() {
    ConnectionStore.removeListener('peersChange', this._onChange);
  }
  onChange() {
    this.setState({
      peerIds: ConnectionStore.getPeerIds()
    });
  }
  render() {
    var peerItems = this.state.peerIds.map(renderPeerItem);
    return (
      <div className="peerList row between-xs">
        {peerItems}
      </div>
    );
  }
}

function renderPeerItem(peerId) {
  return (
    <div className="col-xs-6" key={peerId}>
      <PeerView peerId={peerId} />
    </div>
  );
}

export default PeerList;
