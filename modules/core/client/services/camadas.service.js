'use strict';

angular
  .module('core')
  .service('CamadasSrv', ['$http', 'PATHS', '$rootScope',
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
          return $http.get(PATHS.CAMADAS, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.CAMADAS + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.camada && params.camada._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.CAMADAS, params.camada);
        },
        update: function (params) {
          return $http.put(PATHS.CAMADAS + '/' + params.camada._id, params.camada);
        },
        delete: function (params) {
          return $http.delete(PATHS.CAMADAS + '/' + (params._id || params.id));
        }
      };
    }
  ]);
