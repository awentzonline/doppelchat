import React from 'react';
import {Paper} from 'material-ui';

import PeerImage from 'components/PeerImage';
import ChatUserStore from 'stores/ChatUserStore';

class PeerImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: ChatUserStore.getGroupedProfiles()
    };
  }
  componentDidMount() {
    this._onChange = this.onChange.bind(this)
    ChatUserStore.addListener('change', this._onChange);
  }
  componentWillUnmount() {
    ChatUserStore.removeListener('change', this._onChange);
  }
  onChange() {
    this.setState({
      groups: ChatUserStore.getGroupedProfiles()
    });
  }
  render() {
    var peerItems = this.state.groups.map(renderPeerItem);
    return (
      <div className="peerImageList row between-xs">
        {peerItems}
      </div>
    );
  }
}

function renderPeerItem(item) {
  return (
    <div className="col-xs-6 center-xs peerImageListItem" key={item.imageKey}>
      <PeerImage image={item.image} featureVector={item.featureVector} />
      <span>{item.count}</span>
    </div>
  );
}

export default PeerImageList;
