'use strict';

angular
  .module('core')
  .service('UsersHistorySrv', ['$http', 'PATHS', '$rootScope',
    function ($http, PATHS, $rootScope) {
      return {
        get: function (params) {
          params = params || {};
          if (params && (params._id || params.id)) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getAll: function (params) {
          return $http.get(PATHS.USERS_HISTORY, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.USERS_HISTORY + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.history && params.history._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.USERS_HISTORY, params.history);
        },
        update: function (params) {
          return $http.put(PATHS.USERS_HISTORY + '/' + params.history._id, params.history);
        },
        delete: function (params) {
          return $http.delete(PATHS.USERS_HISTORY + '/' + (params._id || params.id));
        }
      };
    }
  ]);
