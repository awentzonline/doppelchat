import React from 'react';

import {TextField} from 'material-ui';
import ChatActions from 'actions/ChatActions';
import PeerActions from 'actions/PeerActions';
import ChatUserStore from 'stores/ChatUserStore';

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      anonymous: true
    };
  }
  componentDidMount() {
    this._onUserChange = this.onUserChange.bind(this);
    ChatUserStore.addListener('change', this._onUserChange);
  }
  componentWillUnmount() {
    ChatUserStore.removeListener('change', this._onUserChange);
  }
  onUserChange() {
    const profile = ChatUserStore.getLocalProfile();
    this.setState({
      text: this.state.text,
      anonymous: !!profile.anonymous
    });
  }
  render() {
    let message = 'Before you can chat, choose an image';
    if (!this.state.anonymous) {
      message = 'Send a message';
    }
    return (
      <div className="chatInput">
        <form onSubmit={this.onSubmit.bind(this)}>
          <TextField
            hintText="Type your message and hit enter"
            floatingLabelText={message}
            multiLine={false}
            value={this.state.text}
            onChange={this.onTextChanged.bind(this)}
            fullWidth={true}
            autoComplete="off"
            disabled={this.state.anonymous}
             />
        </form>
      </div>
    );
  }
  onTextChanged(event) {
    this.setState({text: event.target.value});
  }
  onSubmit(event) {
    event.preventDefault();
    var text = this.state.text;
    if (text) {
      ChatActions.broadcastChat(text);
    }
    this.setState({text: ''});
  }
}

ChatInput.defaultProps = {
};

export default ChatInput;
