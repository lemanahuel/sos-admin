'use strict';

angular
  .module('users')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('users', {
          url: '/users',
          parent: 'dashboard',
          templateUrl: 'modules/users/views/users.view.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          resolve: {
            Users: ['UsersSrv',
              function(UsersSrv) {
                return UsersSrv.get();
              }
            ]
          }
        })
        .state('io-students', {
          url: '/io-students',
          parent: 'dashboard',
          templateUrl: 'modules/users/views/users.view.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          resolve: {
            Users: ['UsersSrv',
              function(UsersSrv) {
                return UsersSrv.get({
                  role: 2
                });
              }
            ]
          }
        })
        .state('io-teachers', {
          url: '/io-teachers',
          parent: 'dashboard',
          templateUrl: 'modules/users/views/users.view.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          resolve: {
            Users: ['UsersSrv',
              function(UsersSrv) {
                return UsersSrv.get({
                  role: 3
                });
              }
            ]
          }
        })
        .state('user-new', {
          url: '/users/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/users/views/user.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            User: [function() {
              return false;
            }]
          }
        })
        .state('user', {
          url: '/users/:id',
          parent: 'dashboard',
          templateUrl: 'modules/users/views/user.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            User: ['UsersSrv', '$stateParams',
              function(UsersSrv, $stateParams) {
                return UsersSrv.get({
                  _id: $stateParams.id
                });
              }
            ]
          }
        });
    }
  ]);