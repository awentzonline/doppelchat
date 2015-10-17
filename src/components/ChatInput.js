import React from 'react';

import {TextField} from 'material-ui';
import ChatActions from 'actions/ChatActions';
import PeerActions from 'actions/PeerActions';


class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }
  render() {
    return (
      <div className="chatInput">
        <form onSubmit={this.onSubmit.bind(this)}>
          <TextField
            hintText="Type your message and hit enter"
            floatingLabelText="Send a message"
            multiLine={false}
            value={this.state.text}
            onChange={this.onTextChanged.bind(this)}
            fullWidth={true}
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
