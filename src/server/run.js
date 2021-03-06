var serverKey = process.env.PEER_KEY || 'doppelchat';
var serverPort = process.env.PEER_PORT || 9000;
var serverPath = process.env.PEER_PATH || '/';
var allowDiscovery = process.env.PEER_DISCOVERY !== 'off';

console.log([
  'Starting server key:', serverKey,
  ', port:', serverPort,
  ', path:', serverPath].join('')
);

var PeerServer = require('peer').PeerServer;
var server = PeerServer({
  key: serverKey,
  port: serverPort,
  path: serverPath,
  allow_discovery: allowDiscovery
});

server.on('connection', function (id) {
});

server.on('disconnect', function (id) {
});
