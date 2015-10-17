import React from 'react';
import {Paper} from 'material-ui';
import CallView from 'components/CallView';
import PeerStore from 'stores/PeerStore';


class CallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: PeerStore.getCallList()
    };
  }
  componentDidMount() {
    PeerStore.peers.addListener('callsChange', this._onChange.bind(this));
  }
  componentWillUnmount() {
    PeerStore.peers.removeListener('callsChange', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      calls: PeerStore.getCallList()
    });
  }
  render() {
    var peerItems = this.state.calls.map(renderPeerItem);
    return (
      <div className="callList row">
        {peerItems}
      </div>
    );
  }
}

function renderPeerItem(call) {
  return (
    <div className="col-xs-4">
      <Paper zDepth={3}>
        <CallView peerCall={call} />
      </Paper>
    </div>
  );
}

export default CallList;
