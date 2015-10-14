import React from 'react';
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
      <ul className="peerList">
        {peerItems}
      </ul>
    );
  }
}

function renderPeerItem(call) {
  return (
    <li>
      <PeerView peerCall={call} />
    </li>
  );
}

export default PeerList;
