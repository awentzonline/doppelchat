import React from 'react';

import Cropper from 'react-cropper';
import {Dialog, FlatButton, IconButton, Paper, TextField} from 'material-ui';
import FileInput from 'react-file-input';

import config from 'config';
import PeerActions from 'actions/PeerActions';
import ChatUserStore from 'stores/ChatUserStore';
import questionMark from '../images/qmark.png';

class ImageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalImageSrc: questionMark,
      imageSrc: questionMark
    };
  }
  componentDidMount() {
    this._onChatUserChange = this.onChatUserChange.bind(this);
    ChatUserStore.addListener('change', this._onChatUserChange);
  }
  componentWillUnmount() {
    ChatUserStore.removeListener('change', this._onChatUserChange);
  }
  onChatUserChange() {
    const profile = ChatUserStore.getLocalProfile();
    this.setState({
      imageSrc: profile.image,
      originalImageSrc: this.state.originalImageSrc
    });
  }
  render() {
    const errorMessage = '';
    let dialogActions = [
      <FlatButton label="Cancel"
          key={0}
          secondary={true}
          onClick={this.onCancel.bind(this)} />,
      <FlatButton label="Save"
          primary={true}
          key={1}
          onClick={this.onSave.bind(this)} />
    ];
    return (
      <div className="imageInput">
        <img className="previewImage"
            src={this.state.imageSrc}
            alt="Some image"/>
        <Dialog
          ref="imageInputDialog"
          title="Image Picker"
          modal={true}
          actions={dialogActions}>
          <div className="row middle-xs">
            <div className="col-xs-5 center-xs middle-xs imageFileInput">
              <Paper zDepth={2}>
                <label>
                  Choose a file
                  <FileInput name="inputImage"
                      accept=".png,.gif,.jpg,.jpeg"
                      placeholder="Image"
                      onChange={this.onImageFileChanged.bind(this)} />
                </label>
              </Paper>
            </div>
            <div className="col-xs center-xs middle-xs imageUrlInput">
              <form onSubmit={this.onURLSubmit.bind(this)}>
                <TextField
                  ref="url"
                  hintText="Type the URL and hit enter"
                  floatingLabelText="Or enter a URL"
                  multiLine={false}
                  fullWidth={true}
                  autoComplete="off"
                   />
              </form>
            </div>
          </div>
          <div className="col-xs center-xs">
            <Cropper
                ref='cropper'
                src={this.state.originalImageSrc}
                style={{height: '200', width: 'auto'}}
                // Cropper.js options
                aspectRatio={this.props.cropWidth/this.props.cropHeight}
                guides={false} />
          </div>
        </Dialog>
        <div className="col-xs center-xs">
          <FlatButton label="Change"
              onClick={this.onShowDialog.bind(this)}
            />
        </div>
      </div>
    );
  }
  onShowDialog() {
    this.refs.imageInputDialog.show();
  }
  onHideDialog() {
    this.refs.imageInputDialog.dismiss();
  }
  onURLSubmit(event) {
    event.preventDefault();
    this.setState({
      originalImageSrc: this.refs.url.getValue(),
      imageSrc: this.state.imageSrc
    });
  }
  onImageFileChanged(event) {
    var file = event.target.files[0];
    // TODO: transform image and fire the action
    var url = URL.createObjectURL(file);
    this.setState({
      originalImageSrc: url,
      imageSrc: this.state.imageSrc
    });
  }
  onCancel() {
    this.refs.imageInputDialog.dismiss();
  }
  onSave() {
    // Scale the crop
    const canvas = this.refs.cropper.getCroppedCanvas();
    const scaledImage = document.createElement('canvas');
    scaledImage.width = this.props.cropWidth;
    scaledImage.height = this.props.cropHeight;
    const context = scaledImage.getContext('2d');
    context.drawImage(canvas, 0, 0, scaledImage.width, scaledImage.height);
    PeerActions.updateUserImage(scaledImage);
    this.refs.imageInputDialog.dismiss();
  }
}

ImageInput.defaultProps = {
  cropWidth: 512,
  cropHeight: 512
};

export default ImageInput;
