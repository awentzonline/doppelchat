import {EventEmitter} from 'events';
import getUserMedia from 'getusermedia';
import DoppelDispatcher from '../dispatchers/DoppelDispatcher';

const CHANGE_EVENT = 'change';

class UserMediaStore extends EventEmitter {
  constructor() {
    super();
    this.stream = null;
    this.error = null;
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  dispatch(payload) {
    switch (payload.action) {
      case 'acquireUserStream':
        getUserMedia(payload.data, (err, stream) => {
          this.stream = stream;
          this.error = err;
          this.emitChange();
        });
        break;
    }
  }
}

var store = new UserMediaStore();
store.dispatchToken = DoppelDispatcher.register(store.dispatch.bind(store));

export default store;
