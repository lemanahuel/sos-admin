'use strict';

angular
  .module('core')
  .service('ClassesSrv', ['$http', 'PATHS', '$rootScope',
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
          return $http.get(PATHS.CLASSES, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.CLASSES + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.class && params.class._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.CLASSES, params.class);
        },
        update: function (params) {
          return $http.put(PATHS.CLASSES + '/' + params.class._id, params.class);
        },
        delete: function (params) {
          return $http.delete(PATHS.CLASSES + '/' + (params._id || params.id));
        }
      };
    }
  ]);
