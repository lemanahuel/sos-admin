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
  .config(['$authProvider', 'PATHS',
    function($authProvider, PATHS) {
      $authProvider.loginUrl = PATHS.AUTH;
      $authProvider.tokenName = 'token';
      $authProvider.authHeader = 'token';
      $authProvider.authToken = '';
      // $authProvider.withCredentials = false;
      // $authProvider.tokenName = 'ch_token';
      // $authProvider.tokenPrefix = 'ch';
      $authProvider.storageType = 'localStorage';
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
  ]);