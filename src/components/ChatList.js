import React from 'react';
import {Paper} from 'material-ui';

import ChatStore from 'stores/ChatStore';
import PeerActions from 'actions/PeerActions';
import ChatUserStore from 'stores/ChatUserStore';

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vector: [0,0,0,0,0,0,0,0,0,0],
      chatItems: ChatStore.getChatItems()
    };
  }
  componentDidMount() {
    this._onChange = this.onChange.bind(this);
    ChatStore.addListener('change', this._onChange);
    this._onChatUserChange = this.onChatUserChange.bind(this);
    ChatUserStore.addListener('change', this._onChatUserChange);
  }
  componentWillUnmount() {
    ChatStore.removeListener('change', this._onChange);
    ChatUserStore.removeListener('change', this._onChatUserChange);
  }
  onChange() {
    this.setState({
      vector: this.state.vector,
      chatItems: ChatStore.getChatItems()
    });
  }
  onChatUserChange() {
    const profile = ChatUserStore.getLocalProfile();
    this.setState({
      vector: profile.featureVector,
      chatItems: this.state.chatItems
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
  let distance = ChatUserStore.getDistanceToLocal(item.featureVector);
  distance = Math.pow(distance, 3);
  const offsetX = distance * 100;
  //const offsetY = Math.max(0, Math.min(1, distance)) * 50;
  let scale = Math.max(0, 1 - distance);
  // if (distance > 0.2) {
  //   scale *= scale;
  // }
  const itemStyles = {
    position: 'relative',
    left: `${offsetX}%`,
    transformOrigin: 'left center',
    transform: `scale(${scale})`,
    height: `${scale * 92}px`
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
