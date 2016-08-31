'use strict';

const config = require('../config'),
  fs = require('fs'),
  http = require('http'),
  https = require('https');

// Define the Socket.io configuration method
module.exports = (app) => {
  let server = http.createServer(app);
  server.listen(config.port);

  if (process.env.NODE_ENV !== 'production') {
    // Load SSL key and certificate
    // Create new HTTPS Server
    server = https.createServer({
      key: fs.readFileSync('./config/cert/server.key', 'utf8'),
      cert: fs.readFileSync('./config/cert/server.crt', 'utf8')
    }, app);
    server = https.createServer({}, app);
    server.listen(config.securePort);
  }

  return server;
};
