import React from 'react';
import {Paper} from 'material-ui';

import ChatStore from 'stores/ChatStore';

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
      <div className="chatList row">
        <div className="col-md">
          {items}
        </div>
      </div>
    );
  }
}

function renderItem(item) {
  return (
    <div className="row">
      <div className="col-xs">
        <div dangerouslySetInnerHTML={{__html: item.body}}></div>
      </div>
    </div>
  );
}

export default ChatList;
