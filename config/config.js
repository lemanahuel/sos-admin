'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash'),
  chalk = require('chalk'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');

/**
 * Get files by glob patterns
 */
let getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i'),
    output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    _.each(globPatterns, (globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = _.map(files, (file) => {
          if (_.isArray(excludes)) {
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

let cdnifyAssets = (config, assets) => {
  let output = [];
  if (_.isArray(assets) && config && config.cdnPrefix) {
    _.each(assets, (asset) => {
      output.push(config.cdnPrefix + asset + (config.deployTime ? '?t=' + config.deployTime : ''));
    });
    return output;
  }
  return assets;
};

/**
 * Validate NODE_ENV existance
 */
let validateEnvironmentVariable = () => {
  let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  } else {
    console.log(chalk.bold('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'));
  }
  // Reset console color
  console.log(chalk.white(''));
};

/**
 * Initialize global configuration files
 */
let initGlobalConfigFolders = (config) => {
  // Appending files
  config.folders = {
    server: {},
    client: {}
  };

  // Setting globbed client paths
  config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'modules/*/'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Initialize global configuration files
 */
let initGlobalConfigFiles = (config, assets) => {
  // Appending files
  config.files = {
    server: {},
    client: {}
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed socket files
  config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Setting Globbed js files
  config.files.client.js = cdnifyAssets(config, getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.client.js, ['public/'])));

  // Setting Globbed css files
  config.files.client.css = cdnifyAssets(config, getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.client.css, ['public/'])));

  // Setting Globbed test files
  config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
 * Initialize global configuration
 */
let initGlobalConfig = () => {
  // Validate NDOE_ENV existance
  validateEnvironmentVariable();

  // Get the default assets
  let defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

  // Get the current assets
  let environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

  // Merge assets
  let assets = _.extend(defaultAssets, environmentAssets);

  // Get the default config
  let defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

  // Get the current config
  let environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  let envConf = _.extend(defaultConfig, environmentConfig);

  let config = _.merge(envConf, (fs.existsSync(path.join(process.cwd(), 'config/env/local.js')) && require(path.join(process.cwd(), 'config/env/local.js'))) || {});

  if (fs.existsSync(path.join(process.cwd(), 'public/dist/deploy-time.txt'))) {
    config.deployTime = fs.readFileSync(path.join(process.cwd(), 'public/dist/deploy-time.txt'), 'utf8');
  }

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
