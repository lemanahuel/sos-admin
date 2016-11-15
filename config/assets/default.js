'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/angular-loading-bar/build/loading-bar.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.css',
        'public/lib/trix/dist/trix.css',
        'public/lib/ng-sortable/dist/ng-sortable.min.css',
        'public/lib/simplemde/dist/simplemde.min.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/satellizer/dist/satellizer.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/angular-loading-bar/build/loading-bar.min.js',
        'public/lib/ng-file-upload/ng-file-upload-all.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.js',
        'public/lib/angular-trix/dist/angular-trix.min.js',
        'public/lib/angular-i18n/angular-locale_es-ar.js',
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