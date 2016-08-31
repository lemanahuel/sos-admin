'use strict';

angular
  .module('core')
  .service('SessionSrv', ['$http', 'store', '$rootScope',
    function ($http, store, $rootScope) {
      return {
        get: function () {
          return {
            auth_profile: store.get('auth_profile'),
            token: store.get('token'),
            user: store.get('user'),
            profile: store.get('profile')
          };
        },
        set: function (params) {
          if (params.auth_profile) {
            store.set('auth_profile', params.auth_profile);
            $rootScope.AUTH_PROFILE = params.auth_profile;
          }
          if (params.token) {
            store.set('token', params.token);
            $http.defaults.headers.common.Authorization = params.token;
          }
          if (params.user) {
            store.set('user', params.user);
            $rootScope.USER = params.user;
          }
          if (params.profile) {
            store.set('profile', params.profile);
            $rootScope.PROFILE = params.profile;
          }
          return params;
        },
        delete: function () {
          store.remove('auth_profile');
          store.remove('token');
          store.remove('user');
          store.remove('profile');
          return true;
        }
      };
    }
  ]);
