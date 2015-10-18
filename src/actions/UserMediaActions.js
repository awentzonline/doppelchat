import getUserMedia from 'getusermedia';
import Dispatcher from 'dispatchers/DoppelDispatcher';

export default class UserMediaActions {
  static acquireUserStream(options_) {
    var options = options_ || {
      video: true,
      audio: true
    };
    getUserMedia(options, (err, stream) => {
      if (stream) {
        dispatch('userMediaStreamStarted', {
          stream: stream
        });
      } else {
        console.log('error acquiring user stream');
        dispatch('userMediaStreamError', {
          error: err
        });
      }
    })
  }
  static stopUserStream(stream) {
    stream.stop();
    dispatch('userMediaStreamStopped', {
      stream: stream
    });
  }
}

function dispatch(action, data) {
  Dispatcher.dispatch({
    action: action,
    data: data
  });
}
