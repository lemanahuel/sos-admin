'use strict';

angular
  .module('testimonies')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('testimonies', {
          url: '/testimonios',
          parent: 'dashboard',
          templateUrl: 'modules/testimonies/views/testimonies.view.html',
          controller: 'TestimoniesController',
          controllerAs: 'vm',
          resolve: {
            Testimonies: ['TestimoniesSrv',
              function(TestimoniesSrv) {
                return TestimoniesSrv.get();
              }
            ]
          }
        })
        .state('testimony-new', {
          url: '/testimonios/nuevo',
          parent: 'dashboard',
          templateUrl: 'modules/testimonies/views/testimony.view.html',
          controller: 'TestimonyController',
          controllerAs: 'vm',
          resolve: {
            Testimony: [function() {
              return false;
            }]
          }
        })
        .state('testimony', {
          url: '/testimonios/:id',
          parent: 'dashboard',
          templateUrl: 'modules/testimonies/views/testimony.view.html',
          controller: 'TestimonyController',
          controllerAs: 'vm',
          resolve: {
            Testimony: ['TestimoniesSrv', '$stateParams',
              function(TestimoniesSrv, $stateParams) {
                return TestimoniesSrv.get({
                  _id: $stateParams.id
                });
              }
            ]
          }
        });
    }
  ]);