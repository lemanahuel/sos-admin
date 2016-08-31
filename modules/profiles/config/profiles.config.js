'use strict';

angular
  .module('profiles')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('profile-new', {
          url: '/perfiles/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/profiles/views/profile.view.html',
          controller: 'ProfileController',
          controllerAs: 'vm',
          resolve: {
            User: [function () {
              return false;
            }]
          }
        })
        .state('profile', {
          url: '/perfiles/:userId',
          parent: 'dashboard',
          templateUrl: 'modules/profiles/views/profile.view.html',
          controller: 'ProfileController',
          controllerAs: 'vm',
          resolve: {
            User: ['UsersSrv', '$stateParams',
              function (UsersSrv, $stateParams) {
                return UsersSrv.get({
                  _id: $stateParams.userId
                });
              }
            ]
          }
        })
        .state('profile-required', {
          url: '/perfiles-step/:userId',
          templateUrl: 'modules/profiles/views/profile-step.view.html',
          controller: 'ProfileStepController',
          controllerAs: 'vm',
          resolve: {
            User: ['UsersSrv', '$stateParams',
              function (UsersSrv, $stateParams) {
                return UsersSrv.get({
                  _id: $stateParams.userId
                });
              }
            ]
          }
        });
    }
  ]);
