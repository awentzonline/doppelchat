import React from 'react';

import ConnectionStore from 'stores/ConnectionStore';

class P2PStatusComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ConnectionStore.getStatusMessage()
    };
  }
  componentDidMount() {
    ConnectionStore.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    ConnectionStore.removeListener('change', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      status: ConnectionStore.getStatusMessage()
    });
  }
  render() {
    return (
      <div className="p2pStatus col-xs center-xs">
        {this.state.status}
      </div>
    );
  }
}

export default P2PStatusComponent;
