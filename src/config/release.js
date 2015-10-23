import baseConfig from './base';

const config = Object.assign({}, baseConfig, {
  peerServer: {
    host: '159.203.253.111',
    port: 80,
    key: 'doppelchat',
    path: '/'
  }
});

export default config;
