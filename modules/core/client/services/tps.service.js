'use strict';

angular
  .module('core')
  .service('TpsSrv', ['$http', 'PATHS', '$rootScope',
    function ($http, PATHS, $rootScope) {
      return {
        get: function (params) {
          params = params || {};
          if (params && (params._id || params.id)) {
            return this.getById(params);
          }
          return this.getAll(params);
        },
        getByModuleAndUser: function (params) {
          return $http.get(PATHS.TPS, {
            params: {
              moduleId: params.moduleId,
              userId: $rootScope.USER._id
            }
          });
        },
        getAll: function (params) {
          // if ($rootScope.PERMISSIONS.teacher) {
          //   params.camadaId = [];
          //   angular.forEach($rootScope.USER.teachers, function (item) {
          //     params.camadaId.push(item.camada._id);
          //   });
          // } else if ($rootScope.PERMISSIONS.student) {
          //   params.userId = $rootScope.USER._id;
          // } else if ($rootScope.PERMISSIONS.free) {
          //   params.userId = 0;
          // }

          return $http.get(PATHS.TPS, {
            params: params
          });
        },
        getById: function (params) {
          return $http.get(PATHS.TPS + '/' + (params._id || params.id));
        },
        upsert: function (params) {
          params = params || {};
          if (params.tp && params.tp._id) {
            return this.update(params);
          }
          return this.set(params);
        },
        set: function (params) {
          return $http.post(PATHS.TPS, params.tp);
        },
        update: function (params) {
          return $http.put(PATHS.TPS + '/' + params.tp._id, params.tp);
        },
        delete: function (params) {
          return $http.delete(PATHS.TPS + '/' + (params._id || params.id));
        }
      };
    }
  ]);
