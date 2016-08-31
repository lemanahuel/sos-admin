'use strict';

angular
  .module('core')
  .service('SchedulesSrv', ['$http', 'PATHS', '$rootScope',
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
          // if ($rootScope.PERMISSIONS.teacher) {
          //   params.camadaId = [];
          //   angular.forEach($rootScope.USER.teachers, function (item) {
          //     params.camadaId.push(item.camadas_id);
          //   });
          // } else if ($rootScope.PERMISSIONS.student) {
          //   params.camadaId = [];
          //   angular.forEach($rootScope.USER.students, function (item) {
          //     params.camadaId.push(item.camadas_id);
          //   });
          // } else if ($rootScope.PERMISSIONS.free) {
          //   params.camadaId = [0];
          // }
          // console.log(params.camadaId, $rootScope.PERMISSIONS.free);

          return $http.get(PATHS.SCHEDULES, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.SCHEDULES + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.schedule && params.schedule._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.SCHEDULES, params.schedule);
        },
        update: function (params) {
          return $http.put(PATHS.SCHEDULES + '/' + params.schedule._id, params.schedule);
        },
        delete: function (params) {
          return $http.delete(PATHS.SCHEDULES + '/' + (params._id || params.id));
        }
      };
    }
  ]);
