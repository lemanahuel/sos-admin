'use strict';

angular
  .module('core')
  .service('IncidentsSrv', ['$http', 'PATHS',
    function($http, PATHS) {
      return {
        get: function(params) {
          if (params && params._id) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getAll: function(params) {
          return $http.get(PATHS.INCIDENTS, {
            params: params
          });
        },
        getById: function(params) {
          return $http.get(PATHS.INCIDENTS + '/' + params._id);
        },
        upsert: function(params) {
          if (params.user._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function(params) {
          return $http.post(PATHS.INCIDENTS, params.user);
        },
        update: function(params) {
          return $http.put(PATHS.INCIDENTS + '/' + params.user._id, params.user);
        },
        delete: function(params) {
          return $http.delete(PATHS.INCIDENTS + '/' + params._id);
        }
      };
    }
  ]);