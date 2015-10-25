let $ = require('jquery');

export default class CORSImage {
    static checkURL(url, onSuccess, onFail) {
      var img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.onerror = (err) => {
        onFail('Could not load image. Maybe they don\'t allow cross-domain requests.');
      };
      img.onload = () => {
        onSuccess();
      };
      img.src = url;
    }
}
