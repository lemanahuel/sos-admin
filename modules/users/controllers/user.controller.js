'use strict';

angular
  .module('users')
  .controller('UserController', ['User', 'UsersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', '$rootScope',
    function(User, UsersSrv, ModalSrv, $state, $scope, NotificationsSrv, $rootScope) {
      var vm = this;

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);
        vm.userTmp = current;
      }

      setCurrent(User);

      vm.onClickDelete = function(id) {
        ModalSrv.open({
          url: 'modules/users/views/user.remove.view.html',
          confirm: function() {
            UsersSrv.delete({
              _id: id
            }).then(function() {
              NotificationsSrv.removed();
              $state.go('users');
            }, function(err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onSubmit = function() {
        UsersSrv.upsert({
          user: vm.userTmp
        }).then(function(user) {
          if (vm.userTmp._id) {
            NotificationsSrv.updated();
            setCurrent(user);
          } else {
            $state.go('user', {
              id: user && user.data._id
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