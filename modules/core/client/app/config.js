/* eslint angular/window-service: 0 */
'use strict';

window.APP = (function() {
  var NAME = 'SOS-ADMIN';

  return {
    NAME: NAME,
    DEPENDENCIES: [
      'angular-loading-bar',
      'ui.router',
      'ui.bootstrap',
      'ngFileUpload',
      'ui-notification',
      'google.places',
      'ngAnimate',
      'chart.js',
      'angular-storage',
      'auth0'
      //'angular-jwt',
      // 'auth0.auth0',
      // 'auth0.lock'
    ],
    ADD_MODULE: function(moduleName, dependencies) {
      angular.module(moduleName, dependencies || []);
      angular.module(NAME).requires.push(moduleName);
    }
  };
})();