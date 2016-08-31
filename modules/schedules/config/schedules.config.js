'use strict';

angular
  .module('schedules')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('schedules', {
          url: '/agenda',
          parent: 'dashboard',
          templateUrl: 'modules/schedules/views/schedules.view.html',
          controller: 'SchedulesController',
          controllerAs: 'vm',
          resolve: {
            Schedules: ['SchedulesSrv', '$rootScope',
              function (SchedulesSrv, $rootScope) {
                var params = {};
                if ($rootScope.PERMISSIONS.teacher) {
                  params.teacherId = $rootScope.USER._id;
                } else if ($rootScope.PERMISSIONS.student) {
                  params.studentId = $rootScope.USER._id;
                } else if ($rootScope.PERMISSIONS.free) {
                  return false;
                }

                return SchedulesSrv.get(params);
              }
            ]
          }
        })
        .state('schedule-new', {
          url: '/agenda/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/schedules/views/schedule.view.html',
          controller: 'ScheduleController',
          controllerAs: 'vm',
          resolve: {
            Schedules: [function () {
              return false;
            }],
            Camada: [function () {
              return false;
            }],
            Camadas: ['CamadasSrv',
              function (CamadasSrv) {
                return CamadasSrv.get();
              }
            ],
            Remotes: ['RemotesSrv',
              function (RemotesSrv) {
                return RemotesSrv.get();
              }
            ]
          }
        })
        .state('schedule', {
          url: '/agenda/:camadaId',
          parent: 'dashboard',
          templateUrl: 'modules/schedules/views/schedule.view.html',
          controller: 'ScheduleController',
          controllerAs: 'vm',
          resolve: {
            Schedules: ['SchedulesSrv', '$stateParams',
              function (SchedulesSrv, $stateParams) {
                return SchedulesSrv.get({
                  camadaId: $stateParams.camadaId
                });
              }
            ],
            Camada: ['CamadasSrv', '$stateParams',
              function (CamadasSrv, $stateParams) {
                return CamadasSrv.get({
                  _id: $stateParams.camadaId
                });
              }
            ],
            Camadas: ['CamadasSrv',
              function (CamadasSrv) {
                return CamadasSrv.get();
              }
            ],
            Remotes: ['RemotesSrv',
              function (RemotesSrv) {
                return RemotesSrv.get();
              }
            ]
          }
        });
    }
  ]);
