/* eslint angular/window-service: 0 */
'use strict';

window.APP = (function () {
  var NAME = 'CH-ADMIN';

  return {
    NAME: NAME,
    DEPENDENCIES: [
      'angular-loading-bar',
      'ui.router',
      'ui.bootstrap',
      'ngFileUpload',
      'ngCookies',
      'angular-storage',
      'angular-jwt',
      'auth0',
      'ngSanitize',
      'ui-notification',
      'as.sortable',
      'google.places',
      'ui.codemirror',
      'btford.markdown'
    ],
    ADD_MODULE: function (moduleName, dependencies) {
      angular.module(moduleName, dependencies || []);
      angular.module(NAME).requires.push(moduleName);
    }
  };
})();
