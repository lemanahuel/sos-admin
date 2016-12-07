'use strict';

angular
  .module('core')
  .service('TestimoniesSrv', ['$http', 'PATHS',
    function($http, PATHS) {
      return {
        get: function(params) {
          if (params && params._id) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getAll: function(params) {
          return $http.get(PATHS.TESTIMONIES, {
            params: params
          });
        },
        getById: function(params) {
          return $http.get(PATHS.TESTIMONIES + '/' + params._id);
        },
        upsert: function(params) {
          if (params.testimony._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function(params) {
          return $http.post(PATHS.TESTIMONIES, params.testimony);
        },
        update: function(params) {
          return $http.put(PATHS.TESTIMONIES + '/' + params.testimony._id, params.testimony);
        },
        delete: function(params) {
          return $http.delete(PATHS.TESTIMONIES + '/' + params._id);
        }
      };
    }
  ]);