'use strict';

angular
  .module('metrics')
  .controller('MetricsController', ['Incidents', 'Users', '$state', '$scope',
    function(Incidents, Users, $state, $scope) {
      var vm = this;
      var incidentes = Incidents && Incidents.data;

      function normalizeComuna(comuna) {
        return comuna && comuna.toLowerCase().replace(' ', '-');
      }

      function setComunas() {
        var amountOfIncidentsByComuna = [];
        var amountOfResponseByComuna = [];
        var comunas = incidentes.map(function(item) {
          return normalizeComuna(item.comuna);
        }).filter(function(item) {
          return !!item;
        }).filter(function(item, i, ar) {
          return ar.indexOf(item) === i;
        });
        comunas.forEach(function(comuna) {
          var currents = incidentes.filter(function(incident) {
            return normalizeComuna(incident.comuna) === comuna;
          });
          var responses = currents.map(function(item) {
            return item.responses.length;
          }).reduce(function(a, b) {
            return a + b;
          });
          amountOfIncidentsByComuna.push(currents.length);
          amountOfResponseByComuna.push(responses);
        });

        var incidentsTable = [];
        comunas.forEach(function(comuna, i) {
          incidentsTable.push({
            comuna: comuna,
            incidents: amountOfIncidentsByComuna[i],
            responses: amountOfResponseByComuna[i]
          });
        });
        vm.incidentsLabels = comunas;
        vm.incidentsData = amountOfIncidentsByComuna;
        vm.incidentsTable = incidentsTable;
      }

      setComunas();

      // Incidentes(cantidad de incidentes por comuna.Promedio de respuestas.)
      // Voluntarios(Cuantos voluntarios por comuna, y cuantos usuarios son voluntarios, masculinos y femeninos)

      $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.data = [30, 50, 10];
    }
  ]);