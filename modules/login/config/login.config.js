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
          resolve: {}
        })
        .state('logout', {
          url: '/logout',
          controller: 'LogoutController',
          controllerAs: 'vm',
          resolve: {}
        });
    }
  ]);