'use strict';

const path = require('path'),
  //signedRequest = require('./middleware/signed-request'),
  env = process.env.NODE_ENV || 'development',
  partialResponse = require('./middleware/partial-response');

// Root directory for the server
module.exports.rootServer = __dirname;
module.exports.root = path.join(__dirname, '../');

// Handle every response back to the client
module.exports.handleResponse = (res, err, doc, next) => {
  if (err) {
    console.log(err);
    if (next) {
      next(err);
    } else {
      res.status(err.httpCode || 400).json(err);
    }
  } else {
    res.status(200).json(partialResponse.wrap(res, doc));
  }
};

module.exports.domainWhiteList = (host) => {
  let hosts = ['localhost:3004', 'sos-admin-qa.herokuapp.com', 'sos-admin.herokuapp.com', 'admin.coderhouse.com', 'admin.coderhouse.io', 'coderhouse.io', 'coderhouse.com', 'www.coderhouse.io', 'www.coderhouse.com'];
  return hosts.indexOf(host) !== -1;
};
