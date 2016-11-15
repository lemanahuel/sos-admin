'use strict';

angular
  .module('core')
  .factory('CheckAuthInterceptorSrv', ['$injector',
    function ($injector) {
      return {
        request: function (config) {
          return config;
        },
        response: function (res) {
          if (res.data && res.data.error === 'expired') {
            $injector.get('$state').go('logout');
          }
          return res;
        }
      };
    }
  ]);

angular
  .module('core')
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('CheckAuthInterceptorSrv');
  }]);
