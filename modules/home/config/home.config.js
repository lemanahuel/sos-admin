'use strict';

angular
  .module('home')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/agenda',
          parent: 'dashboard',
          templateUrl: 'modules/home/views/home.view.html',
          controller: 'HomeController',
          controllerAs: 'vm',
          resolve: {
            Courses: ['CoursesSrv',
              function (CoursesSrv) {
                return CoursesSrv.get({
                  startDate: new Date().getTime()
                });
              }
            ],
            Careers: ['CareersSrv',
              function (CareersSrv) {
                return CareersSrv.get();
              }
            ],
            Levels: ['LevelsSrv',
              function (LevelsSrv) {
                return LevelsSrv.get();
              }
            ],
            Workshops: ['WorkshopsSrv',
              function (WorkshopsSrv) {
                return WorkshopsSrv.get({
                  startDate: new Date().getTime()
                });
              }
            ]
          }
        });
    }
  ]);
