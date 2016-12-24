'use strict';

angular
  .module('metrics')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('metrics', {
          url: '/metricas',
          parent: 'dashboard',
          templateUrl: 'modules/metrics/views/metrics.view.html',
          controller: 'MetricsController',
          controllerAs: 'vm',
          resolve: {
            Incidents: ['IncidentsSrv',
              function(IncidentsSrv) {
                return IncidentsSrv.get();
              }
            ],
            Users: ['UsersSrv',
              function(UsersSrv) {
                return UsersSrv.get();
              }
            ]
          }
        });
    }
  ]);