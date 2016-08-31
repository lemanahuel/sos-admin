'use strict';

const config = require('../../../../config/env/default');

/**
 * Render the main applicaion page
 */
exports.renderIndex = (req, res) => {
  res.render('modules/core/server/views/index', {
    app: config.app
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = (req, res) => {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...',
    app: config.app
  });
};

/**
 * Render the server not found page
 */
exports.renderNotFound = (req, res) => {
  res.status(404).render('modules/core/server/views/404', {
    url: req.originalUrl,
    app: config.app
  });
};
