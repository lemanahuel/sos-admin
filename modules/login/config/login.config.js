'use strict';

angular
  .module('login')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'modules/login/views/login.view.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          resolve: {
            Authenticated: ['$auth',
              function($auth) {
                console.log('authenticated', $auth);
                return $auth.isAuthenticated();
              }
            ]
          }
        })
        .state('logout', {
          url: '/logout',
          controller: 'LogoutController',
          controllerAs: 'vm',
          resolve: {
            logout: ['$auth',
              function($auth) {
                return $auth.logout();
              }
            ]
          }
        });
    }
  ]);
