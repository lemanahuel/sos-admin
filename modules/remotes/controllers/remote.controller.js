'use strict';

angular
  .module('remotes')
  .controller('RemoteController', ['Remote', 'Classes', 'RemotesSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', '$rootScope',
    function (Remote, Classes, RemotesSrv, ModalSrv, $state, $scope, NotificationsSrv, $rootScope) {
      var vm = this;
      vm.classes = Classes && Classes.data;

      if (!$rootScope.PERMISSIONS.admin) {
        $state.go('remote-live', {
          remoteId: Remote && Remote.data._id
        });
        return;
      }

      function getItem(items, id) {
        var item = null,
          i = 0,
          l = items && items.length;

        for (i; i < l; i++) {
          item = items[i];
          if (item._id === id) {
            return item;
          }
        }
        return false;
      }

      function getClass(id) {
        return getItem(vm.classes, id);
      }

      function getStage(id) {
        return getItem(vm.classTmp.stages, id);
      }

      function setCurrent(current) {
        vm.remoteTmp = current && current.data && current.data._id ? current.data : {};
        if (vm.remoteTmp._id) {
          vm.classTmp = getClass(vm.remoteTmp.class._id);
          vm.stageTmp = getStage(vm.remoteTmp.stage._id);
        }
        console.log(vm.remoteTmp);
      }

      setCurrent(Remote);

      vm.onClickRemove = function () {
        ModalSrv.open({
          url: 'modules/remotes/views/remote.remove.view.html',
          confirm: function () {
            RemotesSrv.delete({
              _id: vm.remoteTmp._id
            }).then(function () {
              NotificationsSrv.removed();
              $state.go('remotes');
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onSubmit = function () {
        if (vm.classTmp._id) {
          vm.remoteTmp.class = vm.classTmp._id;
        }
        if (vm.stageTmp._id) {
          vm.remoteTmp.stage = vm.stageTmp._id;
        }

        RemotesSrv.upsert({
          remote: vm.remoteTmp
        }).then(function (remote) {
          if (!vm.remoteTmp._id) {
            NotificationsSrv.success();
            $state.go('remotes', {
              remoteId: remote.data._id
            });
          } else {
            NotificationsSrv.updated();
            setCurrent(remote);
          }
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };
    }
  ]);
