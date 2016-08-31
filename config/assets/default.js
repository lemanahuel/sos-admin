'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        'public/lib/codemirror/lib/codemirror.css',
        'public/lib/angular-loading-bar/build/loading-bar.min.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        //'public/lib/simplemde/dist/simplemde.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/ng-sortable/dist/ng-sortable.min.css',
        'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.css',
        'public/lib/codemirror/lib/codemirror.css',
        'public/lib/codemirror/theme/monokai.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-loading-bar/build/loading-bar.min.js',
        'public/lib/ng-file-upload/ng-file-upload-all.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/angular-jwt/dist/angular-jwt.min.js',
        'public/lib/a0-angular-storage/dist/angular-storage.min.js',
        'public/lib/auth0-lock/build/auth0-lock.min.js',
        'public/lib/auth0-angular/build/auth0-angular.min.js',
        'public/lib/simplemde/dist/simplemde.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.js',
        'public/lib/ng-sortable/dist/ng-sortable.min.js',
        'public/lib/codemirror/lib/codemirror.js',
        'public/lib/angular-ui-codemirror/ui-codemirror.js',
        'public/lib/codemirror/mode/xml/xml.js',
        'public/lib/codemirror/mode/htmlmixed/htmlmixed.js',
        'public/lib/codemirror/mode/css/css.js',
        'public/lib/codemirror/mode/javascript/javascript.js',
        'public/lib/codemirror/mode/markdown/markdown.js',
        'public/lib/codemirror/addon/hint/show-hint.js',
        'public/lib/codemirror/addon/hint/xml-hint.js',
        'public/lib/codemirror/addon/hint/html-hint.js',
        'public/lib/codemirror/addon/hint/javascript-hint.js',
        'public/lib/showdown/compressed/Showdown.js',
        'public/lib/angular-markdown-directive/markdown.js'
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
      'modules/core/client/services/*.js',
      'modules/core/client/controllers/*.js',
      'modules/core/client/directives/*.js',
      'modules/core/client/filters/*.js',
      'modules/**/*.service.js',
      'modules/ch-directives/**/*.module.js',
      'modules/*/*.module.js',
      'modules/!(core)/**/*.js'
    ],
    views: ['modules/**/*.html']
  },
  server: {
    allJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/core/server/**/*.js'],
    models: ['modules/core/server/models/**/*.js'],
    routes: ['modules/core/server/routes/core.server.routes.js', 'modules/core/server/routes/routes.js'],
    sockets: [],
    config: [],
    policies: [],
    views: 'modules/core/server/views/*.html'
  }
};
