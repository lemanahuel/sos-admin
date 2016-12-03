'use strict';

angular
  .module('incidents')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('incidents', {
          url: '/incidencias',
          parent: 'dashboard',
          templateUrl: 'modules/incidents/views/incidents.view.html',
          controller: 'IncidentsController',
          controllerAs: 'vm',
          resolve: {
            Incidents: ['IncidentsSrv',
              function(IncidentsSrv) {
                return IncidentsSrv.get();
              }
            ]
          }
        })
        .state('incident-new', {
          url: '/incidencias/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/incidents/views/incident.view.html',
          controller: 'IncidentController',
          controllerAs: 'vm',
          resolve: {
            Incident: [function() {
              return false;
            }]
          }
        })
        .state('incident', {
          url: '/incidencias/:id',
          parent: 'dashboard',
          templateUrl: 'modules/incidents/views/incident.view.html',
          controller: 'IncidentController',
          controllerAs: 'vm',
          resolve: {
            Incident: ['IncidentsSrv', '$stateParams',
              function(IncidentsSrv, $stateParams) {
                return IncidentsSrv.get({
                  _id: $stateParams.id
                });
              }
            ]
          }
        });
    }
  ]);