/* eslint angular/window-service: 0 */
'use strict';

window.APP = (function() {
  var NAME = 'CH-DASH';

  return {
    NAME: NAME,
    DEPENDENCIES: [
      'angular-loading-bar',
      'ui.router',
      'satellizer',
      'ui.bootstrap',
      'ngFileUpload',
      'ui-notification',
      'google.places',
      'ngAnimate'
    ],
    ADD_MODULE: function(moduleName, dependencies) {
      angular.module(moduleName, dependencies || []);
      angular.module(NAME).requires.push(moduleName);
    }
  };
})();