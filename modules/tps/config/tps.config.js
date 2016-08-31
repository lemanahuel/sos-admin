'use strict';

angular
  .module('tps')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tps', {
          url: '/tps',
          parent: 'dashboard',
          templateUrl: 'modules/tps/views/tps.view.html',
          controller: 'TpsController',
          controllerAs: 'vm',
          resolve: {
            Tps: ['TpsSrv', '$rootScope',
              function (TpsSrv, $rootScope) {
                var params = {};
                if ($rootScope.PERMISSIONS.teacher) {
                  params.teacherId = $rootScope.USER._id;
                } else if ($rootScope.PERMISSIONS.student) {
                  params.studentId = $rootScope.USER._id;
                } else if ($rootScope.PERMISSIONS.free) {
                  return false;
                }

                return TpsSrv.get(params);
              }
            ]
          }
        })
        .state('tp-new', {
          url: '/tps/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/tps/views/tp.view.html',
          controller: 'TpController',
          controllerAs: 'vm',
          resolve: {
            Modules: ['ModulesSrv',
              function (ModulesSrv) {
                return ModulesSrv.get();
              }
            ],
            Tp: [function () {
              return false;
            }]
          }
        })
        .state('tp', {
          url: '/tps/:tpId',
          parent: 'dashboard',
          templateUrl: 'modules/tps/views/tp.view.html',
          controller: 'TpController',
          controllerAs: 'vm',
          resolve: {
            Modules: ['ModulesSrv',
              function (ModulesSrv) {
                return ModulesSrv.get();
              }
            ],
            Tp: ['TpsSrv', '$stateParams',
              function (TpsSrv, $stateParams) {
                return TpsSrv.get({
                  _id: $stateParams.tpId
                });
              }
            ]
          }
        });
    }
  ]);
