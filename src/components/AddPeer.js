import React from 'react';
import PeerActions from 'actions/PeerActions';

class AddPeerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peerId: ''
    };
  }
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text"
            placeholder="Peer ID"
            value={this.state.peerId}
            onChange={this.onTextChanged.bind(this)}
             />
        </form>
      </div>
    );
  }
  onTextChanged(event) {
    this.setState({peerId: event.target.value});
  }
  onSubmit(event) {
    var peerId = this.state.peerId;
    if (peerId) {
      PeerActions.makeCall(peerId);
    }
    this.setState({peerId: ''});
    event.preventDefault();
  }
}

AddPeerComponent.defaultProps = {
};

export default AddPeerComponent;
