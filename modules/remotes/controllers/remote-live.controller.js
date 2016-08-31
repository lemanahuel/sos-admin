'use strict';

angular
  .module('remotes')
  .controller('RemoteLiveController', ['Schedule', 'RemotesSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', '$sce',
    function (Schedule, RemotesSrv, ModalSrv, $state, $scope, NotificationsSrv, $sce) {
      var vm = this;

      function setCurrent(current) {
        vm.remoteTmp = current && current.data && current.data._id ? current.data : {};
        console.log(vm.remoteTmp);
      }

      setCurrent(Schedule);

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
