'use strict';

angular
  .module('remotes')
  .controller('RemotesController', ['Remotes', '$state', 'RemotesSrv', 'ModalSrv', 'NotificationsSrv', '$rootScope',
    function (Remotes, $state, RemotesSrv, ModalSrv, NotificationsSrv, $rootScope) {
      var vm = this;

      function parseRemotes(remotes) {
        var items = [];
        console.log(remotes);
        if ($rootScope.PERMISSIONS.teacher) {
          angular.forEach(remotes, function (item) {
            items.push(item.remote);
          });
        } else if ($rootScope.PERMISSIONS.student) {
          angular.forEach(remotes, function (item) {
            items.push(item.remote);
          });
        } else if ($rootScope.PERMISSIONS.free) {
          items = [];
        } else {
          items = remotes;
        }
        vm.remotes = items;
      }

      parseRemotes(Remotes && Remotes.data);

      vm.onClickOrderBy = function (by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function (e, id) {
        e.stopPropagation();
        e.preventDefault();
        $state.go($rootScope.PERMISSIONS.admin ? 'remote' : 'remote-live', {
          remoteId: id
        });
      };

      vm.onClickRemove = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.remote,
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
          url: '/modules/remotes/views/remote.remove.view.html',
          confirm: function () {
            RemotesSrv.delete({
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
