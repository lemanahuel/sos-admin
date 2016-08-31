'use strict';

const config = require('../config'),
  express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  //MongoStore = require('connect-mongo')(session),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  //passport = require('passport'),
  flash = require('connect-flash'),
  consolidate = require('consolidate'),
  path = require('path'),
  //db = require('mongoose'),
  helpers = require('../helpers'),
  _ = require('lodash');

module.exports.initLocalVariables = (app) => {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.secure = config.secure;
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;

  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = (app) => {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  if (process.env.NODE_ENV !== 'development') {
    app.enable('trust proxy');
  }

  // Should be placed before express.static
  app.use(compress());

  // Initialize favicon middleware
  app.use(favicon('./modules/core/client/img/ch-icon.ico'));

  app.use(helpers.unforceWww);
  //app.use(helpers.forceHttps);
  //app.use(helpers.legacyApiProxy);
  //app.use(helpers.redirectUpperCase);
  //app.use(helpers.interceptFacebookMeta);

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      var filePattern = /.*\.\w+$/;
      if (filePattern.test(req.path)) {
        res.header('Cache-Control', 'public, max-age=86400');
      } else {
        res.header('Cache-Control', 'public, max-age=3600');
      }
      next();
    });
  }

  // this has to come before prerender
  //app.use(helpers.interceptFacebookMeta);

  // if (process.env.NODE_ENV === 'production') {
  //   app.use(require('prerender-node'));
  // }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
  // app.use(passport.initialize());
  // app.use(passport.session());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = (app) => {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = (app) => {
  // Express MongoDB session storage
  // app.use(session({
  //   key: 'coderhouse',
  //   saveUninitialized: true,
  //   resave: true,
  //   secret: config.sessionSecret,
  //   store: new MongoStore({
  //     mongooseConnection: db.connection,
  //     collection: config.sessionCollection
  //   })
  // }));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = (app) => {
  _.each(config.files.server.configs, (configPath) => {
    require(path.resolve(configPath))(app);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = (app) => {
  // Use helmet to secure Express headers
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = (app) => {

  if (process.env.NODE_ENV === 'development') {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./public')));

    // Globbing static routing
    _.each(config.folders.client, (staticPath) => {
      app.use(staticPath.replace('/client', ''), express.static(path.resolve('./' + staticPath)));
    });
  } else if (process.env.NODE_ENV === 'production') {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./public'), {
      maxAge: 604800000
    }));

    // Globbing static routing
    _.each(config.folders.client, (staticPath) => {
      app.use(staticPath.replace('/client', ''), express.static(path.resolve('./' + staticPath), {
        maxAge: 604800000
      }));
    });
  }
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = (app) => {
  // Globbing policy files
  _.each(config.files.server.policies, (policyPath) => {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = (app) => {
  // Globbing routing files
  _.each(config.files.server.routes, (routePath) => {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = (app) => {
  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/500');
  });

  // Assume 404 since no middleware responded
  app.use((req, res) => {
    // Redirect to not found page
    res.redirect('/404');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = (app) => {
  // Load the Socket.io configuration
  // Return server object
  return require('./socket.io')(app);
};

/**
 * Initialize the Express application
 */
module.exports.init = (db) => {
  // Initialize express app
  let app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  //this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes
  this.initModulesClientRoutes(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app);

  return app;
};
