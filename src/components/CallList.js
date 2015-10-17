import React from 'react';
import {Paper} from 'material-ui';
import CallView from 'components/CallView';
import ConnectionStore from 'stores/ConnectionStore';


class CallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: ConnectionStore.getCallList()
    };
  }
  componentDidMount() {
    ConnectionStore.addListener('callsChange', this._onChange.bind(this));
  }
  componentWillUnmount() {
    ConnectionStore.removeListener('callsChange', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      calls: ConnectionStore.getCallList()
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
