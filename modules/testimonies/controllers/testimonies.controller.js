'use strict';

angular
  .module('testimonies')
  .controller('TestimoniesController', ['Testimonies', 'TestimoniesSrv', 'ModalSrv', '$state',
    function(Testimonies, TestimoniesSrv, ModalSrv, $state) {
      var vm = this;

      function setCurrents(items) {
        vm.testimonies = items && items.data;
        console.log(vm.testimonies);
      }

      setCurrents(Testimonies);

      vm.onClickOrderBy = function(by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function(e, id) {
        e.stopPropagation();
        e.preventDefault();

        $state.go('testimony', {
          id: id
        });
      };

      vm.onClickRemove = function(e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function(id) {
          vm.testimonies = vm.testimonies.filter(function(item) {
            return item._id !== id;
          });
        };

        ModalSrv.open({
          url: 'modules/testimonies/views/testimony.remove.view.html',
          confirm: function() {
            findAndRemove(id);
          }
        });
      };
    }
  ]);