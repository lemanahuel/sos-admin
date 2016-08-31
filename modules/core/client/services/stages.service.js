'use strict';

angular
  .module('core')
  .service('StagesSrv', ['$http', 'PATHS', '$rootScope',
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
          return $http.get(PATHS.STAGES, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.STAGES + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.stage && params.stage._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.STAGES, params.stage);
        },
        update: function (params) {
          return $http.put(PATHS.STAGES + '/' + params.stage._id, params.stage);
        },
        delete: function (params) {
          return $http.delete(PATHS.STAGES + '/' + (params._id || params.id));
        }
      };
    }
  ]);
