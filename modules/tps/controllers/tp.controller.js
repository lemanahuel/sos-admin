'use strict';

angular
  .module('tps')
  .controller('TpController', ['Tp', 'Modules', 'TpsSrv', 'ModalSrv', '$state', '$rootScope', 'NotificationsSrv',
    function (Tp, Modules, TpsSrv, ModalSrv, $state, $rootScope, NotificationsSrv) {
      var vm = this;
      vm.currentUnity = {};

      function setCurrent(current) {
        vm.tpTmp = current && current.data && current.data._id ? current.data : {};
        console.log(vm.tpTmp);
      }

      setCurrent(Tp);

      vm.onClickRemove = function () {
        ModalSrv.open({
          url: 'tps/tps/views/module.remove.view.html',
          confirm: function () {
            TpsSrv.delete({
              _id: vm.tpTmp._id
            }).then(function () {
              NotificationsSrv.removed();
              $state.go('tps');
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onClickStatus = function (status) {
        vm.tpTmp.status = status;
      };

      vm.onSubmit = function () {
        TpsSrv.upsert({
          tp: vm.tpTmp
        }).then(function (tp) {
          if (!vm.tpTmp._id) {
            NotificationsSrv.success();
            $state.go('tp', {
              tpId: tp.data._id
            });
          } else {
            NotificationsSrv.updated();
            setCurrent(tp);
          }
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };
    }
  ]);
