import baseConfig from './base';

const config = Object.assign({}, baseConfig, {
  peerServer: {
    host: 'localhost',
    port: 9000,
    key: 'doppelchat',
    path: '/'
  }
});

export default config;
