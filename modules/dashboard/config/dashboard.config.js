'use strict';

angular
  .module('dashboard')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('dashboard', {
          url: '',
          templateUrl: 'modules/dashboard/views/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          resolve: {
            Authenticated: ['$auth',
              function($auth) {
                return $auth.isAuthenticated();
              }
            ]
          }
        });
    }
  ]);
