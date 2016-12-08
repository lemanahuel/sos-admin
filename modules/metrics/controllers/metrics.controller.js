'use strict';

angular
  .module('metrics')
  .controller('MetricsController', ['Incidents', 'Users', '$state', '$scope',
    function(Incidents, Users, $state, $scope) {
      var vm = this;
      var incidentes = Incidents && Incidents.data;
      var users = Users && Users.data;
      var comunas = [];

      function normalizeComuna(comuna) {
        return comuna && comuna.toLowerCase().replace(' ', '-');
      }

      function normalizeComunas() {
        incidentes = incidentes.map(function(item) {
          item.comuna = normalizeComuna(item.comuna);
          return item;
        });
      };

      normalizeComunas();

      function setComunas() {
        comunas = incidentes.map(function(item) {
          return item.comuna;
        }).filter(function(item) {
          return !!item;
        }).filter(function(item, i, ar) {
          return ar.indexOf(item) === i;
        });
      }

      setComunas();

      function setIncidentsChart() {
        var amountOfIncidentsByComuna = [];
        var amountOfResponseByComuna = [];

        comunas.forEach(function(comuna) {
          var currents = incidentes.filter(function(incident) {
            return incident.comuna && incident.comuna === comuna;
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

      setIncidentsChart();

      function setVolunteersChart() {
        var volunteersByComuna = 0;
        var civils = users.filter(function(item) {
          return !item.isVolunteer;
        });
        var volunteers = users.filter(function(item) {
          return item.isVolunteer;
        });

        vm.volunteersLabels = ['Civil', 'Voluntarios'];
        vm.volunteersData = [civils.length, volunteers.length];

        var volunteersTable = [];
        var amountOfVolunteersByComuna = [];
        var amountOfCivilsByComuna = [];
        var comunas = volunteers.map(function(item) {
          return normalizeComuna(item.comuna);
        }).filter(function(item) {
          return !!item;
        }).filter(function(item, i, ar) {
          return ar.indexOf(item) === i;
        });

        comunas.forEach(function(comuna) {
          amountOfVolunteersByComuna.push(volunteers.filter(function(item) {
            return item.comuna && normalizeComuna(item.comuna) === comuna;
          }).length);
          amountOfCivilsByComuna.push(civils.filter(function(item) {
            return item.comuna && normalizeComuna(item.comuna) === comuna;
          }).length);
        });

        comunas.forEach(function(comuna, i) {
          volunteersTable.push({
            comuna: comuna,
            volunteers: amountOfVolunteersByComuna[i],
            civils: amountOfCivilsByComuna[i]
          });
        });

        vm.volunteersByComunaData = amountOfVolunteersByComuna;
        vm.volunteersByComunaLabels = comunas;
        vm.volunteersTable = volunteersTable;
      }

      setVolunteersChart();

      // Voluntarios(Cuantos voluntarios por comuna, y cuantos usuarios son voluntarios, masculinos y femeninos)
    }
  ]);