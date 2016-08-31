'use strict';
const config = require('./config/config');

module.exports = (app) => {
  let passport = require('passport');
  let Auth0Strategy = require('passport-auth0');
  let strategy = new Auth0Strategy({
    domain: 'coderhouse.auth0.com',
    clientID: config.auth0.clientID,
    clientSecret: config.auth0.clientSecret,
    callbackURL: config.auth0.callbackURL
  }, function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams._id_token has the JSON Web Token
    // profile has all the information from the user
    console.log(accessToken, refreshToken, extraParams, profile, done);
    return done(null, profile);
  });

  passport.use(strategy);

  // This is not a best practice, but we want to keep things simple for now
  passport.serializeUser(function (user, done) {
    console.log('serializeUser', user, done);
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log('deserializeUser', user, done);
    done(null, user);
  });

  return strategy;
};

// clientID: process.env.AUTH0_APP_ID || 'Vtm9iFF02cj93Yp2AsbjnXQ6ppghaYWh',
//   clientSecret: process.env.AUTH0_APP_SECRET || '6039D_bq20JZtDjFko9DMCOFid3RcJRDjyY0JAyXlbg-FWwY9P6HB8Po3REsK9J9',
//   callbackURL: process.env.AUTH0_CALLBACK_URL || 'callback'
