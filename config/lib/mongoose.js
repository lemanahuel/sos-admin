'use strict';

const config = require('../config'),
  path = require('path'),
  _ = require('lodash');

// Load the mongoose models
module.exports.loadModels = () => {
  // Globbing model files
  _.each(config.files.server.models, (modelPath) => {
    require(path.resolve(modelPath));
  });
};

// Initialize Mongoose
module.exports.connect = (cb) => {
};
module.exports.disconnect = (cb) => {
};
