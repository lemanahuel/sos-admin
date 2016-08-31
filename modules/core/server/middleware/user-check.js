'use strict';

const helpers = require('../helpers');

module.exports = (req, res, next) => {
  if (req.headers.authorization && helpers.domainWhiteList(req.headers.host)) {
    next();
  } else {
    helpers.handleResponse(res, {
      err: 'not-valid-r'
    });
  }
};
