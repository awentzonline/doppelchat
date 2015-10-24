import React from 'react';
import {Paper} from 'material-ui';

import ChatStore from 'stores/ChatStore';
import PeerActions from 'actions/PeerActions';
import ChatUserStore from 'stores/ChatUserStore';

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatItems: ChatStore.getChatItems()
    };
  }
  componentDidMount() {
    ChatStore.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    ChatStore.removeListener('change', this._onChange.bind(this));
  }
  _onChange() {
    this.setState({
      chatItems: ChatStore.getChatItems()
    });
  }
  render() {
    var items = this.state.chatItems.map(renderItem);
    return (
      <div className="chatList col-xs">
        {items}
      </div>
    );
  }
}

function renderItem(item) {
  const distance = ChatUserStore.getDistanceToLocal(item.featureVector);
  const offsetX = distance * 50;
  const offsetY = Math.max(0, Math.min(1, distance)) * 50;
  const itemStyles = {
    position: 'relative',
    left: `${offsetX}%`,
    transformY: `-${distance}%`
  }
  function onImageClick() {
    PeerActions.updateUserImageFromURL(item.image, item.featureVector);
  }
  return (
    <div className="row chatItem" style={itemStyles}>
      <div className="col-xs">
        <div className="chatImage" onClick={onImageClick}>
          <img src={item.image} />
        </div>
        <p>
          {item.body}
        </p>
      </div>
    </div>
  );
}

export default ChatList;
