'use strict';

const env = process.env.NODE_ENV || 'development',
  _ = require('lodash'),
  request = require('request');

module.exports.forceHttps = (req, res, next) => {
  let host = req.hostname;

  if (!req.secure) {
    if (env === 'development') {
      host = 'localhost:3042';
    }
    if (host === 'voluntariosos.org' || host === 'sos-admin-prod.herokuapp.com') {
      host = 'admin.voluntariosos.org';
    }
    if (req.url.indexOf('/api/') !== 0) {
      res.redirect(301, 'https://' + host + req.url);
    } else {
      next();
    }
  } else if (host === 'voluntariosos.org' || host === 'sos-admin-prod.herokuapp.com') {
    res.redirect(301, 'https://admin.voluntariosos.org' + req.url);
  } else {
    next();
  }
};