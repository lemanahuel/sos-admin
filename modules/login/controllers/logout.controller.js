'use strict';

angular
  .module('login')
  .controller('LogoutController', ['$state', 'SessionSrv',
    function($state, SessionSrv) {
      SessionSrv.delete();
      $state.go('login', {
        reload: true
      });
    }
  ]);
