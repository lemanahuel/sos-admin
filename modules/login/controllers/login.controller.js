'use strict';

angular
  .module('login')
  .controller('LoginController', ['Authenticated', '$auth', '$state', 'UsersSrv', 'SessionSrv', 'PermissionsSrv', 'NotificationsSrv',
    function(Authenticated, $auth, $state, UsersSrv, SessionSrv, PermissionsSrv, NotificationsSrv) {
      var vm = this;
      vm.error = '';

      if (Authenticated) {
        $state.go('dashboard');
      }

      vm.onClickLogin = function() {
        vm.error = '';
        $auth.login({
          email: vm.email,
          password: vm.password
        }).then(function(res) {
          var user = res && res.data && res.data.user;
          if (user) {
            SessionSrv.set({
              user: user
            });
            PermissionsSrv.set(user);
            $state.go('dashboard');
          } else {
            NotificationsSrv.error({
              msg: 'Chequea la consola, no te pudiste logear'
            });
            console.debug(res.data);
          }
        }, function(err) {
          NotificationsSrv.error({
            msg: 'Chequea la consola, no te pudiste logear'
          });
          console.debug(err);
        });
      };
    }
  ]);
