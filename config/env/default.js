'use strict';

module.exports = {
  app: {
    site: 'http://voluntariosos.io',
    title: 'Coderhouse | Cursos de Programación, Marketing y Diseño',
    description: 'Escuela de Programación Web y Mobile, Diseño UX y Marketing Online. Cursos presenciales y remotos.',
    keywords: '',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3002,
  securePort: 3042,
  templateEngine: 'swig',
  sessionSecret: '43oi3dfs445o3_i5h4i-5h3$oi4f%324f343%',
  sessionCollection: 'sessions',
  cdnPrefix: process.env.CDN_PREFIX || false,
  auth0: {
    clientID: process.env.AUTH0_APP_ID || 'Vtm9iFF02cj93Yp2AsbjnXQ6ppghaYWh',
    clientSecret: process.env.AUTH0_APP_SECRET || '6039D_bq20JZtDjFko9DMCOFid3RcJRDjyY0JAyXlbg-FWwY9P6HB8Po3REsK9J9',
    callbackURL: process.env.AUTH0_CALLBACK_URL || '/callback'
  },
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID || 'ERROR_APP_ID',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'ERROR_APP_SECRET',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'ERROR_CALLBACK_URL'
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'RROR_CONSUMER_KEY',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'ERROR_CONSUMER_SECRET',
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'ERROR_CALLBACK_URL'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};
