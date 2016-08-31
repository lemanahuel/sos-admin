'use strict';

const config = require('../../../../config/config');

module.exports = (app) => {
  let core = require('../controllers/core.server.controller');
  app.route('/500').get(core.renderServerError);
  app.route('/404').get(core.renderNotFound);
  app.route('/').get(core.renderIndex);
};
