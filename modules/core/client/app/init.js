/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */
'use strict';

window.sup = function () {
  console['log']('¯\\_(ツ)_/¯, by Coderhouse Full Stack Team');
};

//Start by defining the main module and adding the module dependencies
angular.module(APP.NAME, APP.DEPENDENCIES);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }

  //Then init the app
  angular.bootstrap(document, [APP.NAME], {
    strictDi: true
  });

  window.sup();
});
