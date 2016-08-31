'use strict';

angular
  .module('core')
  .service('ModulesSrv', ['$http', 'PATHS', '$rootScope',
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
          return $http.get(PATHS.MODULES, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.MODULES + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.module && params.module._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.MODULES, params.module);
        },
        update: function (params) {
          return $http.put(PATHS.MODULES + '/' + params.module._id, params.module);
        },
        delete: function (params) {
          return $http.delete(PATHS.MODULES + '/' + (params._id || params.id));
        }
      };
    }
  ]);
