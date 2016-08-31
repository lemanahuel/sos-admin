'use strict';

angular
  .module('camadas')
  .controller('CamadasController', ['Camadas', 'CamadasSrv', '$state', 'ModalSrv', '$rootScope', 'NotificationsSrv',
    function (Camadas, CamadasSrv, $state, ModalSrv, $rootScope, NotificationsSrv) {
      var vm = this;
      vm.camadas = Camadas && Camadas.data;
      vm.currentOrder = '-id';

      vm.onClickOrderBy = function (by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function (e, id) {
        if (!e.target.href) {
          e.stopPropagation();
          e.preventDefault();
          $state.go('camada', {
            camadaId: id
          });
        }
      };

      vm.onClickRemove = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.camadas,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          for (i = l - 1; i >= 0; i--) {
            item = items[i];
            if (item._id === id) {
              items.splice(i, 1);
            }
          }
        };

        ModalSrv.open({
          url: '/modules/camadas/views/camada.remove.view.html',
          confirm: function () {
            CamadasSrv.delete({
              camadaId: id
            }).then(function () {
              NotificationsSrv.removed();
              findAndRemove(id);
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };
    }
  ]);
