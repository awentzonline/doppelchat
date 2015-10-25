import React from 'react';

import {TextField} from 'material-ui';
import PeerActions from 'peers/PeerActions';


class AddPeerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peerId: ''
    };
  }
  render() {
    return (
      <div className="addPeer">
        <form onSubmit={this.onSubmit.bind(this)}>
          <TextField
            hintText="Peer ID"
            floatingLabelText="Add a peer"
            multiLine={false}
            value={this.state.peerId}
            onChange={this.onTextChanged.bind(this)}
            fullWidth={true}
             />
        </form>
      </div>
    );
  }
  onTextChanged(event) {
    this.setState({peerId: event.target.value});
  }
  onSubmit(event) {
    event.preventDefault();
    var peerId = this.state.peerId;
    if (peerId) {
      PeerActions.makeCall(peerId);
    }
    this.setState({peerId: ''});
  }
}

AddPeerComponent.defaultProps = {
};

export default AddPeerComponent;
