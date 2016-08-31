'use strict';

angular
  .module('camadas')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('camadas', {
        url: '/camadas',
        parent: 'dashboard',
        templateUrl: 'modules/camadas/views/camadas.view.html',
        controller: 'CamadasController',
        controllerAs: 'vm',
        resolve: {
          Camadas: ['CamadasSrv', '$rootScope',
            function (CamadasSrv, $rootScope) {
              var params = {};
              if ($rootScope.PERMISSIONS.teacher) {
                params.teacherId = $rootScope.USER._id;
              } else if ($rootScope.PERMISSIONS.student) {
                params.studentId = $rootScope.USER._id;
              } else if ($rootScope.PERMISSIONS.free) {
                return false;
              }

              return CamadasSrv.get(params);
            }
          ]
        }
      })
      .state('camada-new', {
        url: '/camadas/nuevo',
        parent: 'dashboard',
        templateUrl: 'modules/camadas/views/camada.view.html',
        controller: 'CamadaController',
        controllerAs: 'vm',
        resolve: {
          Camada: [function () {
            return false;
          }],
          Teachers: ['UsersSrv', '$rootScope', function (UsersSrv, $rootScope) {
            if ($rootScope.PERMISSIONS.admin) {
              return UsersSrv.get({
                role: 3
              });
            }
            return false;
          }],
          Students: ['UsersSrv', '$rootScope', function (UsersSrv, $rootScope) {
            if ($rootScope.PERMISSIONS.admin) {
              return UsersSrv.get({
                role: 2
              });
            }
            return false;
          }],
          Classes: ['ClassesSrv', '$rootScope', function (ClassesSrv, $rootScope) {
            if ($rootScope.PERMISSIONS.admin) {
              return ClassesSrv.get();
            }
            return false;
          }]
        }
      })
      .state('camada', {
        url: '/camadas/:camadaId',
        parent: 'dashboard',
        templateUrl: 'modules/camadas/views/camada.view.html',
        controller: 'CamadaController',
        controllerAs: 'vm',
        resolve: {
          Camada: ['CamadasSrv', '$stateParams', function (CamadasSrv, $stateParams) {
            return CamadasSrv.get({
              _id: $stateParams.camadaId
            });
          }],
          Teachers: ['UsersSrv', '$rootScope', function (UsersSrv, $rootScope) {
            if ($rootScope.PERMISSIONS.admin) {
              return UsersSrv.get({
                role: 3
              });
            }
            return false;
          }],
          Students: ['UsersSrv', '$rootScope', function (UsersSrv, $rootScope) {
            if ($rootScope.PERMISSIONS.admin) {
              return UsersSrv.get({
                role: 2
              });
            }
            return false;
          }],
          Classes: ['ClassesSrv', '$rootScope', function (ClassesSrv, $rootScope) {
            if ($rootScope.PERMISSIONS.admin) {
              return ClassesSrv.get();
            }
            return false;
          }]
        }
      });
  }]);
