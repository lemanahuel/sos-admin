'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/angular-bootstrap/dist/ui-bootstrap-csp.css',
        'node_modules/font-awesome/css/font-awesome.min.css',
        'node_modules/angular-loading-bar/build/loading-bar.min.css',
        'node_modules/angular-ui-notification/dist/angular-ui-notification.min.css',
        'node_modules/angular-google-places-autocomplete/dist/autocomplete.min.css'
      ],
      js: [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/satellizer/dist/satellizer.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-file-upload/dist/angular-file-upload.min.js',
        'node_modules/angular-loading-bar/build/loading-bar.min.js',
        'node_modules/ng-file-upload/dist/ng-file-upload-all.min.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/angular-ui-notification/dist/angular-ui-notification.min.js',
        'node_modules/angular-google-places-autocomplete/dist/autocomplete.min.js',
        'node_modules/angular-i18n/angular-locale_es-ar.js',
        'node_modules/chart.js/dist/Chart.min.js',
        'node_modules/angular-chart.js/dist/angular-chart.min.js',
        'node_modules/angular-storage/dist/angular-storage.min.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/angular-jwt/dist/angular-jwt.min.js',
        'public/lib/auth0-lock/build/auth0-lock.min.js',
        'public/lib/auth0-angular/build/auth0-angular.min.js',
      ]
    },
    css: [
      'modules/*/css/*.css',
      'modules/**/css/*.css',
      'modules/core/client/css/*.css'
    ],
    less: [
      'modules/*/css/*.less',
      'modules/**/css/*.less',
      'modules/core/client/css/*.less'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/core/client/*.js',
      'modules/core/client/config/*.js',
      'modules/**/*.interceptor.js',
      'modules/ch-directives/**/*.module.js',
      'modules/*/*.module.js',
      'modules/**/*.service.js',
      'modules/!(core)/**/*.js'
    ],
    views: ['modules/**/*.html']
  },
  server: {
    allJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/core/server/**/*.js'],
    models: 'modules/core/server/models/**/*.js',
    routes: ['modules/core/server/routes/**/*.js'],
    sockets: [],
    config: ['modules/core/server/config/*.js'],
    policies: [],
    views: 'modules/core/server/views/*.html'
  }
};