'use strict';

angular
  .module('remotes')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('remotes', {
          url: '/remotos',
          parent: 'dashboard',
          templateUrl: 'modules/remotes/views/remotes.view.html',
          controller: 'RemotesController',
          controllerAs: 'vm',
          resolve: {
            Remotes: ['RemotesSrv',
              function (RemotesSrv) {
                return RemotesSrv.get();
              }
            ]
          }
        })
        .state('remote-new', {
          url: '/remotos/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/remotes/views/remote.view.html',
          controller: 'RemoteController',
          controllerAs: 'vm',
          resolve: {
            Remote: [function () {
              return false;
            }],
            Classes: ['ClassesSrv',
              function (ClassesSrv) {
                return ClassesSrv.get();
              }
            ]
          }
        })
        .state('remote', {
          url: '/remotos/:scheduleId',
          parent: 'dashboard',
          templateUrl: 'modules/remotes/views/remote.view.html',
          controller: 'RemoteController',
          controllerAs: 'vm',
          resolve: {
            Remote: ['RemotesSrv', '$stateParams',
              function (RemotesSrv, $stateParams) {
                return RemotesSrv.get({
                  _id: $stateParams.remoteId
                });
              }
            ],
            Classes: ['ClassesSrv',
              function (ClassesSrv) {
                return ClassesSrv.get();
              }
            ]
          }
        })
        .state('remote-live', {
          url: '/remotos/:scheduleId/live',
          parent: 'dashboard',
          templateUrl: 'modules/remotes/views/remote-live.view.html',
          controller: 'RemoteLiveController',
          controllerAs: 'vm',
          resolve: {
            Schedule: ['SchedulesSrv', '$stateParams',
              function (SchedulesSrv, $stateParams) {
                return SchedulesSrv.get({
                  _id: $stateParams.scheduleId
                });
              }
            ]
          }
        });
    }
  ]);
