'use strict';

angular
  .module('home')
  .controller('HomeController', ['Courses', 'Careers', 'Levels', 'Workshops', '$state', '$window', 'DAYS',
    function(Courses, Careers, Levels, Workshops, $state, $window, DAYS) {
      var vm = this;
      vm.currentCoursesOrder = 'startDate';
      vm.currentWorkhopsOrder = 'date';
      vm.careers = Careers && Careers.data;
      vm.levels = Levels && Levels.data;
      vm.workshops = Workshops && Workshops.data;

      function setCurrentCountry() {
        var country = $window.localStorage.getItem('currentCountry');
        if (country) {
          vm.currentCountry = country;
        }
      }

      setCurrentCountry();

      vm.onChangeCountry = function() {
        $window.localStorage.setItem('currentCountry', vm.currentCountry);
      };

      vm.getDays = function(item) {
        var days = DAYS;

        if (item && item.fromDay) {
          if (item.fromDay !== item.toDay) {
            return days[item.fromDay] + ' y ' + days[item.toDay];
          }
          return days[item.fromDay];
        }
      };

      function parseCourses(courses) {
        courses.forEach(function(course) {
          if (!course.coworking || (course.camada && course.camada.teachers && !course.camada.teachers.length)) {
            course.pending = true;
          } else {
            course.pending = false;
          }
        });
        vm.courses = courses;
      }

      parseCourses(Courses && Courses.data);

      vm.getAcronim = function(career) {
        var title = null;

        switch (parseInt(career.id_career)) {
          case 1:
            title = 'Front End - ';
            break;
          case 2:
            title = 'Full Stack - ';
            break;
          case 3:
            title = 'Móvil - ';
            break;
          case 4:
            title = '';
            break;
          case 5:
            title = 'MKT - ';
            break;
          case 6:
            title = 'WP - ';
            break;
          default:
            title = career.title;
        }

        return title;
      };

      vm.onClickEdit = function(e, id) {
        e.preventDefault();
        e.stopPropagation();
        $state.go('course', {
          id: id
        });
      };

      vm.onClickOrderCoursesBy = function(by) {
        vm.currentCoursesOrder = vm.currentCoursesOrder !== by ? by : '-' + by;
      };

      vm.onClickOrderWorkhopsBy = function(by) {
        vm.currentWorkhopsOrder = vm.currentWorkhopsOrder !== by ? by : '-' + by;
      };
    }
  ]);
