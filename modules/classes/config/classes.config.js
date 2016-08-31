'use strict';

angular
  .module('classes')
  .config(['$stateProvider',
    function ($stateProvider) {
      var params = {
        url: '/cursos',
        parent: 'dashboard',
        templateUrl: 'modules/classes/views/classes.view.html',
        controller: 'ClassesController',
        controllerAs: 'vm',
        resolve: {
          Classes: ['ClassesSrv', '$rootScope',
            function (ClassesSrv, $rootScope) {
              var params = {};
              if ($rootScope.PERMISSIONS.free) {
                return false;
              }

              return ClassesSrv.get(params);
            }
          ],
          UserHistory: ['UsersHistorySrv', '$rootScope',
            function (UsersHistorySrv, $rootScope) {
              if ($rootScope.PERMISSIONS.student) {
                return UsersHistorySrv.get({
                  userId: $rootScope.USER._id
                });
              }
              return false;
            }
          ],
          Tps: ['TpsSrv', '$rootScope',
            function (TpsSrv, $rootScope) {
              if ($rootScope.PERMISSIONS.student) {
                return TpsSrv.get({
                  studentId: $rootScope.USER._id
                });
              }
              return false;
            }
          ],
          Camadas: ['CamadasSrv', '$rootScope',
            function (CamadasSrv, $rootScope) {
              var params = {};
              if ($rootScope.PERMISSIONS.teacher) {
                params.teacherId = $rootScope.USER._id;
                return CamadasSrv.get(params);
              } else if ($rootScope.PERMISSIONS.student) {
                params.studentId = $rootScope.USER._id;
                return CamadasSrv.get(params);
              }
              return false;
            }
          ]
        }
      };

      $stateProvider
        .state('classes', angular.extend({}, params))
        .state('classes-stages', angular.extend({}, params, {
          reloadOnSearch: false,
          url: '/cursos/:classId/clases'
        }))
        .state('classes-stages-modules', angular.extend({}, params, {
          reloadOnSearch: false,
          url: '/cursos/:classId/clases/:stageId/contenidos'
        }));
    }
  ]);
