import {EventEmitter} from 'events';
import DoppelDispatcher from 'dispatchers/DoppelDispatcher';

const CHANGE_EVENT = 'change';

class UserMediaStore extends EventEmitter {
  constructor() {
    super();
    this.stream = null;
    this.error = null;
  }
  dispatch(payload) {
    switch (payload.action) {
      case 'userMediaStreamStarted':
        this.stream = payload.data.stream;
        this.error = null;
        this.emitChange();
        break;
      case 'userMediaStreamError':
        this.stream = null;
        this.error = payload.data.error;
        this.emitChange();
        break;
      case 'userMediaStreamStopped':
        this.stream = null;
        this.error = null;
        this.emitChange();
        break;
    }
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}

var store = new UserMediaStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
