'use strict';

angular
  .module('incidents')
  .controller('IncidentsController', ['Incidents', 'IncidentsSrv', 'ModalSrv', '$state',
    function(Incidents, IncidentsSrv, ModalSrv, $state) {
      var vm = this;

      function setCurrents(items) {
        vm.incidents = items && items.data;
        console.log(vm.incidents);
      }

      setCurrents(Incidents);

      vm.onClickOrderBy = function(by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function(e, id) {
        e.stopPropagation();
        e.preventDefault();

        $state.go('incident', {
          id: id
        });
      };

      vm.onClickRemove = function(e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function(id) {
          vm.incidents = vm.incidents.filter(function(item) {
            return item._id !== id;
          });
        };

        ModalSrv.open({
          url: 'modules/incidents/views/incident.remove.view.html',
          confirm: function() {
            findAndRemove(id);
          }
        });
      };
    }
  ]);