'use strict';

angular
  .module('core')
  .service('CapacitationCentersSrv', ['$http', 'PATHS',
    function($http, PATHS) {
      return {
        get: function(params) {
          if (params && params._id) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getAll: function(params) {
          params = params || {};
          return $http.get(PATHS.CAPACITATION_CENTERS, {
            params: params
          });
        },
        getById: function(params) {
          return $http.get(PATHS.CAPACITATION_CENTERS + '/' + params._id);
        },
        upsert: function(params) {
          if (params.center._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function(params) {
          return $http.post(PATHS.CAPACITATION_CENTERS, params.center);
        },
        update: function(params) {
          return $http.put(PATHS.CAPACITATION_CENTERS + '/' + params.center._id, params.center);
        },
        delete: function(params) {
          return $http.delete(PATHS.CAPACITATION_CENTERS + '/' + params._id);
        }
      };
    }
  ]);