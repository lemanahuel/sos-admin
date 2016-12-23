/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

angular
  .module('core')
  .config(['$locationProvider',
    function($locationProvider) {
      $locationProvider.html5Mode(false);
    }
  ])
  .config(['$urlRouterProvider',
    function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/capacitation-centers');
    }
  ])
  .config(['cfpLoadingBarProvider',
    function(cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
    }
  ])
  .config(['$logProvider',
    function($logProvider) {
      $logProvider.debugEnabled(location.href.indexOf('localhost') !== -1);
      //  $logProvider.debugEnabled(true);
    }
  ])
  .config(['$compileProvider',
    function($compileProvider) {
      $compileProvider.debugInfoEnabled(location.href.indexOf('localhost') !== -1);
      //$compileProvider.debugInfoEnabled(true);
    }
  ])
  .config(['$httpProvider',
    function($httpProvider) {
      $httpProvider.defaults.cache = false;
      $httpProvider.useApplyAsync(true);
    }
  ])
  .run(['$rootScope', 'SessionSrv', 'PermissionsSrv',
    function($rootScope, SessionSrv, PermissionsSrv) {
      var session = SessionSrv.get();
      if (session && session.user) {
        $rootScope.USER = session.user;
        SessionSrv.set(session);
        PermissionsSrv.set(session.user);
      }
    }
  ])
  .config(['authProvider', function(authProvider) {
    authProvider.init({
      domain: 'juanpablosolari.auth0.com',
      clientID: 'BlhdUAGVs8nENr11fvdOYov8oy5w3np6',
      callbackUrl: location.href,
      loginState: 'login'
    });
  }])
  .run(['auth', function(auth) {
    auth.hookEvents();
  }]);