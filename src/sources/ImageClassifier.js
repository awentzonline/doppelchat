import convnetjs from 'convnetjs';

class ImageClassifier {
  // Adapted from https://github.com/karpathy/convnetjs/blob/master/demo/js/images-demo.js
  constructor() {
    this.setup();
  }
  setup() {
    this.net = new convnetjs.Net();
    this.net.fromJSON(require('./cifar10_snapshot.json'));
  }
  classify(canvas) {
    const scaledImage = document.createElement('canvas');
    scaledImage.width = 32;
    scaledImage.height = 32;
    const context = scaledImage.getContext('2d');
    context.drawImage(canvas, 0, 0, scaledImage.width, scaledImage.height);
    let x = imageDataToVol(context.getImageData(0, 0, scaledImage.width, scaledImage.height));
    this.net.forward(x);
    let layer = this.net.layers[this.net.layers.length - 2];
    return layer.out_act.w;
  }
  getCifar10Labels(y) {
    const classesTxt = ['airplane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck'];
    let results = classesTxt.map(function (label, i) {
      var v = y[i];
      return [
        v, label
      ];
    });
    results.sort();
    return results;
  }
}

function imageDataToVol(imageData) {
  const W = imageData.width * imageData.height;
  const p = imageData.data;
  const imageChannels = p.length / W;
  const x = new convnetjs.Vol(imageData.width, imageData.height, imageChannels, 0.0);
  const k = 0;
  let j = 0;
  for (let dc = 0; dc < imageChannels; dc++) {
    let i = 0;
    for (let xc = 0; xc < imageData.width; xc++) {
      for (let yc = 0; yc < imageData.height; yc++) {
        let ix = ((W * k) + i) * 4 + dc;
        x.set(yc, xc, dc, p[ix] / 255.0 - 0.5);
        i++;
      }
    }
  }
  return x;
}

const classifier = new ImageClassifier();
export default classifier;
