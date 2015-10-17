import React from 'react';


class VideoStreamComponent extends React.Component {
  render() {
    var stream = this.props.stream
    if (stream) {
      var url = window.URL || window.webkitURL;
      var videoSrc = url ? url.createObjectURL(stream) : stream;
      return (
        <div className="videoStream">
          <video src={videoSrc} autoPlay muted={this.props.muted}
              width={this.props.width} height={this.props.height} />
        </div>
      );
    } else {
      return (
        <div className="videoStream">
          No stream
        </div>
      );
    }
  }
}

VideoStreamComponent.defaultProps = {
  stream: null,
  muted: true,
  width: null,
  height: null
};

export default VideoStreamComponent;
