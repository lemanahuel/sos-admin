'use strict';

angular
  .module('tps')
  .controller('TpsController', ['Tps', 'TpsSrv', '$state', 'ModalSrv', '$rootScope', 'NotificationsSrv',
    function (Tps, TpsSrv, $state, ModalSrv, $rootScope, NotificationsSrv) {
      var vm = this;
      vm.currentOrder = 'translateKey';
      vm.tps = Tps && Tps.data;
      console.log(vm.tps);

      function setCamadas() {
        var items = [];
        var matchedIds = [];
        if (!$rootScope.PERMISSIONS.student) {
          angular.forEach(vm.tps, function (tp) {
            if (tp.camada) {
              if (!matchedIds.length || matchedIds.indexOf(tp.camada._id) === -1) {
                items.push(tp.camada);
                matchedIds.push(tp.camada._id);
              }
            } else {
              console.log(tp);
            }
          });
          vm.camadas = items;
        }
      }

      setCamadas();

      vm.onClickOrderBy = function (by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function (e, id) {
        if (!e.target.href) {
          e.stopPropagation();
          e.preventDefault();
          $state.go('tp', {
            tpId: id
          });
        }
      };

      vm.onClickRemove = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.tps,
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
          url: '/tps/tps/views/module.remove.view.html',
          confirm: function () {
            TpsSrv.delete({
              _id: id
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
