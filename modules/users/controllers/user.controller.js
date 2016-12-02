'use strict';

angular
  .module('users')
  .controller('UserController', ['User', 'UsersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', 'ROLES', '$rootScope',
    function(User, UsersSrv, ModalSrv, $state, $scope, NotificationsSrv, ROLES, $rootScope) {
      var vm = this;
      vm.roles = ROLES;

      vm.geoConfig = {
        types: ['geocode']
      };

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);

        vm.userTmp = current;
      }

      setCurrent(User);

      vm.onSubmit = function() {
        UsersSrv.upsert({
          user: vm.userTmp
        }).then(function(user) {
          if (vm.userTmp._id) {
            NotificationsSrv.updated();
            setCurrent(user);
          } else {
            $state.go('users', {
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