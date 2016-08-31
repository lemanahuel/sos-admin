'use strict';

angular
  .module('modules')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('module-new', {
          url: '/cursos/:classId/clases/:stageId/contenidos/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/modules/views/module.view.html',
          controller: 'ModuleController',
          controllerAs: 'vm',
          resolve: {
            Class: ['ClassesSrv', '$stateParams',
              function (ClassesSrv, $stateParams) {
                return ClassesSrv.get({
                  _id: $stateParams.classId
                });
              }
            ],
            Stage: ['StagesSrv', '$stateParams',
              function (StagesSrv, $stateParams) {
                return StagesSrv.get({
                  _id: $stateParams.stageId
                });
              }
            ],
            Modules: ['ModulesSrv', '$stateParams',
              function (ModulesSrv, $stateParams) {
                return ModulesSrv.get({
                  classId: $stateParams.classId,
                  stageId: $stateParams.stageId
                });
              }
            ],
            Module: [function () {
              return false;
            }],
            Tp: [function () {
              return false;
            }],
            UserHistory: [function () {
              return false;
            }]
          }
        })
        .state('module', {
          url: '/cursos/:classId/clases/:stageId/contenidos/:moduleId',
          parent: 'dashboard',
          templateUrl: 'modules/modules/views/module.view.html',
          controller: 'ModuleController',
          controllerAs: 'vm',
          resolve: {
            Class: ['ClassesSrv', '$stateParams',
              function (ClassesSrv, $stateParams) {
                return ClassesSrv.get({
                  _id: $stateParams.classId
                });
              }
            ],
            Stage: ['StagesSrv', '$stateParams',
              function (StagesSrv, $stateParams) {
                return StagesSrv.get({
                  _id: $stateParams.stageId
                });
              }
            ],
            Modules: ['ModulesSrv', '$stateParams',
              function (ModulesSrv, $stateParams) {
                return ModulesSrv.get({
                  classId: $stateParams.classId,
                  stageId: $stateParams.stageId
                });
              }
            ],
            Module: ['ModulesSrv', '$stateParams',
              function (ModulesSrv, $stateParams) {
                return ModulesSrv.get({
                  _id: $stateParams.moduleId
                });
              }
            ],
            Tp: ['UsersSrv', '$stateParams', '$rootScope',
              function (UsersSrv, $stateParams, $rootScope) {
                if ($rootScope.PERMISSIONS.student) {
                  return UsersSrv.get({
                    moduleId: $stateParams.moduleId,
                    _id: $rootScope.USER._id
                  });
                }
                return false;
              }
            ],
            UserHistory: ['UsersHistorySrv', '$stateParams', '$rootScope',
              function (UsersHistorySrv, $stateParams, $rootScope) {
                if ($rootScope.PERMISSIONS.student || $rootScope.PERMISSIONS.teacher) {
                  return UsersHistorySrv.get({
                    classId: $stateParams.classId,
                    userId: $rootScope.USER._id
                  });
                }
                return false;
              }
            ],
            Camada: ['CamadasSrv', '$stateParams', '$rootScope', function (CamadasSrv, $stateParams, $rootScope) {
              if ($rootScope.PERMISSIONS.student || $rootScope.PERMISSIONS.teacher) {
                var where = {};
                if ($rootScope.PERMISSIONS.student) {
                  where.studentId = $rootScope.USER._id;
                } else if ($rootScope.PERMISSIONS.teacher) {
                  where.teacherId = $rootScope.USER._id;
                }
                return CamadasSrv.get(angular.extend({}, where, {
                  classId: $stateParams.classId
                }));
              }
              return false;
            }]
          }
        });
    }
  ]);
