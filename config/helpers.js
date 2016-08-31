'use strict';

const env = process.env.NODE_ENV || 'development',
  _ = require('lodash'),
  request = require('request');

module.exports.forceHttps = (req, res, next) => {
  let host = req.hostname;

  if (!req.secure) {
    if (env === 'development') {
      host = 'localhost:3040';
    }
    if (host === 'coderhouse.io' || host === 'ch-www.herokuapp.com') {
      host = 'www.coderhouse.io';
    }
    if (req.url.indexOf('/api/') !== 0) {
      res.redirect(301, 'https://' + host + req.url);
    } else {
      next();
    }
  } else if (host === 'coderhouse.io' || host === 'ch-www.herokuapp.com') {
    res.redirect(301, 'https://www.coderhouse.io' + req.url);
  } else {
    next();
  }
};

module.exports.unforceWww = (req, res, next) => {
  let host = req.hostname;

  if (env === 'development') {
    host = 'localhost:3004';
  }

  if (host === 'www.coderhouse.io' || host === 'ch-www.herokuapp.com') {
    host = 'coderhouse.io';
    res.redirect(301, 'http://' + host + req.url);
  } else {
    next();
  }
};

module.exports.redirectUpperCase = (req, res, next) => {
  let lowerPath = req.path.toLowerCase();

  if (lowerPath !== req.path && req.path !== '/m3TAK8ueVrNB4xPscqvVRSMu0Aw.html') {
    res.redirect(301, req.url.replace(req.path, lowerPath));
  } else {
    next();
  }
};

module.exports.interceptFacebookMeta = (req, res, next) => {
  let userAgent = req.headers && req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : false;

  if (userAgent && (userAgent.indexOf('facebot') !== -1 || userAgent.indexOf('facebookexternalhit') !== -1)) {
    let pathArr = req.path.split('/'),
      cleanPathArr = [];

    _.each(pathArr, (p) => {
      if (p) {
        cleanPathArr.push(p);
      }
    });

    let apiHost = 'localhost:3002';
    if (req.hostname === 'www.coderhouse.io' || req.hostname === 'ch-www.herokuapp.com') {
      apiHost = 'api.coderhouse.io';
    } else if (req.hostname === 'ch-www-qa.herokuapp.com') {
      apiHost = 'ch-api-qa.herokuapp.com';
    }

    if (cleanPathArr.length === 2) {
      request.get({
        url: 'https://' + apiHost + '/facebook/meta',
        rejectUnauthorized: false,
        qs: {
          url: cleanPathArr.join('/')
        }
      }, (err, r, data) => {
        if (!err && r.statusCode === 200 && data) {
          res.send(data);
        } else {
          next();
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};
