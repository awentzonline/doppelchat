import React from 'react';
import {Paper} from 'material-ui';
import PeerView from 'components/PeerView';
import PeerStore from 'stores/PeerStore';


class PeerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: PeerStore.getCallList()
    };
  }
  componentDidMount() {
    PeerStore.peers.addListener('peersChange', this._onChange.bind(this));
  }
  componentWillUnmount() {
    PeerStore.peers.removeListener('peersChange', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      calls: PeerStore.getCallList()
    });
  }
  render() {
    var peerItems = this.state.calls.map(renderPeerItem);
    return (
      <div className="peerList row">
        {peerItems}
      </div>
    );
  }
}

function renderPeerItem(call) {
  return (
    <div className="col-xs-4">
      <Paper zDepth={3}>
        <PeerView peerCall={call} />
      </Paper>
    </div>
  );
}

export default PeerList;
