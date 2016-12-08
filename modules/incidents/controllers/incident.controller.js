'use strict';

angular
  .module('incidents')
  .controller('IncidentController', ['Incident', 'IncidentsSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', '$rootScope',
    function(Incident, IncidentsSrv, ModalSrv, $state, $scope, NotificationsSrv, $rootScope) {
      var vm = this;

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);

        vm.incidentTmp = current;
      }

      setCurrent(Incident);

      vm.onClickDelete = function() {
        ModalSrv.open({
          url: 'modules/incidents/views/incident.remove.view.html',
          confirm: function() {
            IncidentsSrv.delete({
              _id: vm.incidentTmp._id
            }).then(function() {
              NotificationsSrv.removed();
              $state.go('incidents');
            }, function(err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onSubmit = function() {
        IncidentsSrv.upsert({
          incident: vm.incidentTmp
        }).then(function(incident) {
          if (vm.incidentTmp._id) {
            NotificationsSrv.updated();
            setCurrent(incident);
          } else {
            $state.go('incident', {
              id: incident && incident.data._id
            });
            NotificationsSrv.success();
          }
        }, function(err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };
    }
  ]);