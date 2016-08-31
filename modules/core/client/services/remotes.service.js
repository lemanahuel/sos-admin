'use strict';

angular
  .module('core')
  .service('RemotesSrv', ['$http', 'PATHS', '$rootScope', 'SchedulesSrv',
    function ($http, PATHS, $rootScope, SchedulesSrv) {
      return {
        get: function (params) {
          params = params || {};
          if (params && (params._id || params.id)) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getAll: function (params) {
          if (!$rootScope.PERMISSIONS.admin) {
            return SchedulesSrv.get();
          }

          return $http.get(PATHS.REMOTES, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.REMOTES + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.remote && params.remote._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.REMOTES, params.remote);
        },
        update: function (params) {
          return $http.put(PATHS.REMOTES + '/' + params.remote._id, params.remote);
        },
        delete: function (params) {
          return $http.delete(PATHS.REMOTES + '/' + (params._id || params.id));
        }
      };
    }
  ]);
