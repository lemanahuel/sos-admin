'use strict';

angular
  .module('users')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('users', {
          url: '/usuarios',
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
        .state('volunteers', {
          url: '/voluntarios',
          parent: 'dashboard',
          templateUrl: 'modules/users/views/users.view.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          resolve: {
            Users: ['UsersSrv',
              function(UsersSrv) {
                return UsersSrv.get({
                  isVolunteer: true
                });
              }
            ]
          }
        })
        .state('user-new', {
          url: '/usuarios/nuevo',
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
          url: '/usuarios/:id',
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