'use strict';

angular
  .module('capacitation-centers')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('capacitation-centers', {
          url: '/capacitation-centers',
          parent: 'dashboard',
          templateUrl: 'modules/capacitation-centers/views/capacitation-centers.view.html',
          controller: 'CapacitationCentersController',
          controllerAs: 'vm',
          resolve: {
            CapacitationCenters: ['CapacitationCentersSrv',
              function(CapacitationCentersSrv) {
                return CapacitationCentersSrv.get();
              }
            ]
          }
        })
        .state('capacitation-center-new', {
          url: '/capacitation-centers/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/capacitation-centers/views/capacitation-center.view.html',
          controller: 'CapacitationCenterController',
          controllerAs: 'vm',
          resolve: {
            CapacitationCenter: [function() {
              return false;
            }]
          }
        })
        .state('capacitation-center', {
          url: '/capacitation-centers/:id',
          parent: 'dashboard',
          templateUrl: 'modules/capacitation-centers/views/capacitation-center.view.html',
          controller: 'CapacitationCenterController',
          controllerAs: 'vm',
          resolve: {
            CapacitationCenter: ['CapacitationCentersSrv', '$stateParams',
              function(CapacitationCentersSrv, $stateParams) {
                return CapacitationCentersSrv.get({
                  _id: $stateParams.id
                });
              }
            ]
          }
        });
    }
  ]);