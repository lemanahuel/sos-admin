'use strict';

angular
  .module('core')
  .service('UsersSrv', ['$http', 'PATHS', '$rootScope',
    function ($http, PATHS, $rootScope) {
      return {
        get: function (params) {
          params = params || {};
          if (params && params.moduleId) {
            return this.getTpByModule(params);
          } else if (params && (params._id || params.id)) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getAll: function (params) {
          return $http.get(PATHS.USERS, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.USERS + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          if (params.user._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.USERS, params.user);
        },
        update: function (params) {
          return $http.put(PATHS.USERS + '/' + params.user._id, params.user);
        },
        delete: function (params) {
          return $http.delete(PATHS.USERS + '/' + (params._id || params.id));
        },
        getTpByModule: function (params) {
          return $http.get(PATHS.USERS + '/' + params._id, {
            params: params
          });
        }
      };
    }
  ]);
