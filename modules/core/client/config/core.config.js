/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

angular
  .module('core')
  .config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.html5Mode(false);
    }
  ])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');
    }
  ])
  .config(['cfpLoadingBarProvider',
    function (cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
    }
  ])
  .config(['$logProvider',
    function ($logProvider) {
      $logProvider.debugEnabled(location.href.indexOf('localhost') !== -1);
      //  $logProvider.debugEnabled(true);
    }
  ])
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.debugInfoEnabled(location.href.indexOf('localhost') !== -1);
      //$compileProvider.debugInfoEnabled(true);
    }
  ])
  .config(['$sceProvider',
    function ($sceProvider) {
      $sceProvider.enabled(false);
    }
  ])
  .config(['$httpProvider',
    function ($httpProvider) {
      //$httpProvider.defaults.cache = location.href.indexOf('localhost') !== -1;
      $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
      $httpProvider.defaults.headers.common['Expires'] = '0';
      $httpProvider.defaults.cache = false;
      $httpProvider.useApplyAsync(true);
    }
  ])
  .config(['authProvider', function (authProvider) {
    var clientID = 'Vtm9iFF02cj93Yp2AsbjnXQ6ppghaYWh';

    if (window.CH_API.indexOf('-dev') !== -1) {
      clientID = '5Ss2ALEXayjienKtFPWsu9PWv38RBI8H';
    } else if (window.CH_API.indexOf('-qa') !== -1) {
      clientID = 'WE06fjmBy47OFCPkSeE9cOkQeVBo3MEt';
    } else if (window.CH_API.indexOf('localhost') !== -1) {
      clientID = '5Ss2ALEXayjienKtFPWsu9PWv38RBI8H';
    }

    authProvider.init({
      domain: 'coderhouse.auth0.com',
      clientID: clientID,
      callbackUrl: location.href,
      loginState: 'login'
    });
  }])
  .config(['NotificationProvider', function (NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2500,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top'
    });
  }])
  .run(['auth', function (auth) {
    auth.hookEvents();
  }])
  .run(['$rootScope', 'SessionSrv', 'PermissionsSrv',
    function ($rootScope, SessionSrv, PermissionsSrv) {
      var session = SessionSrv.get();
      if (session && session.auth_profile && session.token && session.user) {
        $rootScope.AUTH_PROFILE = session.auth_profile;
        $rootScope.USER = session.user;
        SessionSrv.set(session);
        PermissionsSrv.set(session.user);
      }
    }
  ]);
