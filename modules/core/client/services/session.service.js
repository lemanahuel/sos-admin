'use strict';

angular
  .module('core')
  .service('SessionSrv', ['$http', '$rootScope',
    function($http, $rootScope) {
      return {
        get: function() {
          var user = localStorage.getItem('user');
          user = user ? JSON.parse(user) : user;

          return {
            user: user
          };
        },
        set: function(params) {
          if (params.user) {
            localStorage.setItem('user', JSON.stringify(params.user));
            $rootScope.USER = params.user;
          }
          return params;
        },
        delete: function() {
          localStorage.removeItem('user');
          return true;
        }
      };
    }
  ]);
