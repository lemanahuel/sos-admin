'use strict';

angular
  .module('core')
  .service('ProfilesSrv', ['$http', 'PATHS', '$rootScope',
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
          return $http.get(PATHS.PROFILES, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.PROFILES + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.profile && params.profile._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.PROFILES, params.profile);
        },
        update: function (params) {
          return $http.put(PATHS.PROFILES + '/' + params.profile._id, params.profile);
        },
        delete: function (params) {
          return $http.delete(PATHS.PROFILES + '/' + (params._id || params.id));
        }
      };
    }
  ]);
