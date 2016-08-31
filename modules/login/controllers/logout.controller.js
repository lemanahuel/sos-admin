'use strict';

angular
  .module('login')
  .controller('LogoutController', ['$state', 'auth', 'SessionSrv',
    function($state, auth, SessionSrv) {
      auth.signout();
      SessionSrv.delete();
      $state.go('login');
    }
  ]);