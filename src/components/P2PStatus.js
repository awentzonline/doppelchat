import React from 'react';
import PeerStore from 'stores/PeerStore';


class P2PStatusComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: PeerStore.getStatusMessage()
    };
  }
  componentDidMount() {
    PeerStore.peers.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    PeerStore.peers.removeListener('change', this._onChange.bind(this));
  }
  _onChange() {
    console.log('state changed')
    this.setState({
      status: PeerStore.getStatusMessage()
    });
  }
  render() {
    return (
      <div>
        {this.state.status}
      </div>
    );
  }
}

export default P2PStatusComponent;
