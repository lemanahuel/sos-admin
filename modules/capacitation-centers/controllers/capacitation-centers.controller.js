'use strict';

angular
  .module('io-users')
  .controller('CapacitationCentersController', ['CapacitationCenters', 'ModalSrv', 'CapacitationCentersSrv', '$state',
    function(CapacitationCenters, ModalSrv, CapacitationCentersSrv, $state) {
      var vm = this;

      function setCurrents(items) {
        vm.capacitationCenters = items && items.data;
      }

      setCurrents(CapacitationCenters);

      vm.onClickEdit = function(e, id) {
        e.stopPropagation();
        e.preventDefault();
        $state.go('capacitation-center', {
          id: id
        });
      };

      vm.onClickRemove = function(e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function(id) {
          vm.capacitationCenters = vm.capacitationCenters.filter(function(item) {
            return item._id !== id;
          });
          // CapacitationCentersSrv.delete({
          //   _id: id
          // }).then(function() {
          //   NotificationsSrv.removed();
          // }, function(err) {
          //   NotificationsSrv.error();
          //   console.debug(err);
          // });
        };

        ModalSrv.open({
          url: '/modules/capacitation-centers/views/capacitation-centers.remove.view.html',
          confirm: function() {
            findAndRemove(id);
          }
        });
      };
    }
  ]);