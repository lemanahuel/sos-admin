'use strict';

angular
  .module('errors')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('404', {
          url: '/404',
          templateUrl: 'modules/errors/views/errors.view.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          resolve: {
            Home: ['HomeSrv',
              function(HomeSrv) {
                return HomeSrv.get();
              }
            ],
            Status: function() {
              return '404';
            }
          }
        })
        .state('500', {
          url: '/500',
          templateUrl: 'modules/errors/views/errors.view.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          resolve: {
            Home: ['HomeSrv',
              function(HomeSrv) {
                return HomeSrv.get();
              }
            ],
            Status: function() {
              return '500';
            }
          }
        });
    }
  ]);
