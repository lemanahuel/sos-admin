'use strict';

angular
  .module('capacitation-centers')
  .controller('CapacitationCentersController', ['CapacitationCenters', 'ModalSrv', 'CapacitationCentersSrv', '$state',
    function(CapacitationCenters, ModalSrv, CapacitationCentersSrv, $state) {
      var vm = this;

      function setCurrents(items) {
        vm.capacitationCenters = items && items.data;
        console.log(vm.capacitationCenters)
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
          url: 'modules/capacitation-centers/views/capacitation-center.remove.view.html',
          confirm: function() {
            findAndRemove(id);
          }
        });
      };
    }
  ]);