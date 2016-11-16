'use strict';

angular
  .module('capacitation-centers')
  .controller('CapacitationCenterController', ['CapacitationCenter', 'Careers', 'Levels', 'UsersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', 'ROLES', 'TEACHER_STATUS', 'TEACHER_ROLE', 'TEACHER_MODALITY', 'COURSES_COLORS', 'COURSES_LOGOS', 'DAYS', '$rootScope',
    function(CapacitationCenter, Careers, Levels, UsersSrv, ModalSrv, $state, $scope, NotificationsSrv, ROLES, TEACHER_STATUS, TEACHER_ROLE, TEACHER_MODALITY, COURSES_COLORS, COURSES_LOGOS, DAYS, $rootScope) {
      var vm = this;
      vm.roles = ROLES;
      vm.teacherRole = TEACHER_ROLE;
      vm.teacherModality = TEACHER_MODALITY;
      vm.careers = Careers && Careers.data;
      vm.levels = Levels && Levels.data;

      vm.teacherStatus = [];
      angular.forEach(TEACHER_STATUS, function(value, key) {
        vm.teacherStatus.push({
          key: key,
          value: value
        });
      });

      function isTeacher(role) {
        return parseInt(role, 10) === 3;
      }

      function isStudent(role) {
        return parseInt(role, 10) === 2;
      }

      vm.geoConfig = {
        types: ['geocode']
      };

      function getCourseStyles(className) {
        var style = null;
        var logo = null;
        className = className ? className.toLowerCase() : className;

        if (className.indexOf('diseñador') !== -1) {
          style = 'disenador-web';
        } else if (className.indexOf('programador') !== -1) {
          style = 'programador-web';
        } else if (className.indexOf('frontend') !== -1) {
          style = 'frontend';
        } else if (className.indexOf('fullstack') !== -1) {
          style = 'fullstack';
        } else if (className.indexOf('mobile') !== -1) {
          style = 'movil';
        } else if (className.indexOf('gráfico') !== -1) {
          style = 'disenador-grafico';
        } else if (className.indexOf('ux design') !== -1) {
          style = 'diseno-ux';
        } else if (className.indexOf('marketing digital avanzado') !== -1) {
          style = 'marketing2';
        } else if (className.indexOf('marketing digital') !== -1) {
          style = 'marketing1';
        } else if (className.indexOf('wordpress avanzado') !== -1) {
          style = 'wordpress2';
        } else if (className.indexOf('wordpress') !== -1) {
          style = 'wordpress1';
        } else if (className.indexOf('angular 2') !== -1) {
          style = 'diseno';
          logo = COURSES_LOGOS.angular;
        } else if (className.indexOf('html y css') !== -1) {
          style = 'disenador-web';
          logo = COURSES_LOGOS.htmlcss;
        } else if (className.indexOf('react') !== -1) {
          style = 'wordpress1';
          logo = COURSES_LOGOS.react;
        }

        return {
          logo: logo ? logo : COURSES_LOGOS[style],
          style: COURSES_COLORS[style]
        }
      }

      function parseCertification(className) {
        if (className && className.toLowerCase().indexOf('(versión 2)') !== -1) {
          return className.replace('(Versión 2)', '');
        }
        return className;
      }

      function setCertificationLinkedin(user) {
        angular.forEach(user.profile.certifications, function(item) {
          var certLinkedin = 'https://www.linkedin.com/profile/add';
          certLinkedin += '?_ed=0_JhwrBa9BO0xNXajaEZH4qchmXj_bl7e8YUqBLyHMpFamjuhvQxj9mAY5hdRFzAvUaSgvthvZk7wTBMS3S-m0L6A6mLjErM6PJiwMkk6nYZylU7__75hCVwJdOTZCAkdv';
          certLinkedin += '&pfCertificationName=' + item.class.name;
          certLinkedin += '&pfCertificationUrl=' + item.url;
          certLinkedin += '&pfLicenseNo=' + item._id;
          certLinkedin += '&pfCertStartDate=201601';
          certLinkedin += '&pfCertFuture=201612';
          certLinkedin += '&trk=onsite_html';
          var styles = getCourseStyles(item.class.name);
          item.logo = styles.logo;
          item.style = styles.style;
          item.class.name = parseCertification(item.class.name);

          item.linkedinUrl = certLinkedin;
          console.log(item);
        });
      }

      function setCurrent(current) {
        current = current && current.data || {};
        current.profile = current.profile || {};
        current.role = current.role ? String(current.role) : '';
        current.status = current.status ? String(current.status) : '';
        console.log(current);
        current.profile.bday = current.profile && current.profile.bday ? new Date(current.profile.bday) : '';

        if (!current.profile.country) {
          current.profile.country = 'Argentina';
        }

        if (current.profile.certifications && current.profile.certifications.length) {
          setCertificationLinkedin(current);
        }

        //Only Teachers
        if (!current.profile.courses) {
          current.profile.courses = {};
        }

        if (current.feedbacks && current.feedbacks.teacher && current.feedbacks.teacher.feedbacks.length && current.courses && current.courses.length) {
          current.courses.map(function(item) {
            var feedbacks = current.feedbacks.teacher.feedbacks.filter(function(feedback) {
              return parseInt(feedback.hidden.camada, 10) === parseInt(item.camada.id, 10);
            });
            var rating = feedbacks && feedbacks.length && feedbacks.map(function(item) {
              return item.rating;
            });
            if (rating) {
              rating = rating.reduce(function(a, b) {
                return a + b;
              });
              rating = rating / feedbacks.length;
            }
            item.feedbacks = {
              teacher: {
                feedbacks: feedbacks,
                rating: rating
              }
            };
            return item;
          });
        }

        vm.isTeacher = isTeacher(current.role);
        vm.isStudent = isStudent(current.role);

        vm.ioUserTmp = current;
      }

      setCurrent(IOUser);

      vm.onClickShowFeedbacks = function(e, feedbacks) {
        e.preventDefault();
        ModalSrv.open({
          url: 'modules/coworkings/views/feedbacks.modal.html',
          size: 'lg',
          params: {
            feedbacks: feedbacks
          }
        });
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

      vm.onChangeRole = function() {
        console.log(123);
        vm.isTeacher = isTeacher(vm.ioUserTmp.role);
        vm.isStudent = isStudent(vm.ioUserTmp.role);
      };

      vm.onClickCanTeach = function(e) {
        e.preventDefault();

        if (vm.ioUserTmp.profile.canTeach) {
          var alreadyCan = vm.ioUserTmp.profile.canTeach.find(function(item) {
            return item === vm.id_level;
          });
          if (!alreadyCan) {
            vm.ioUserTmp.profile.canTeach.push(vm.id_level);
          }
        } else {
          vm.ioUserTmp.profile.canTeach = [];
          vm.ioUserTmp.profile.canTeach.push(vm.id_level);
        }

        console.log(vm.ioUserTmp.profile.canTeach);
      };

      vm.onClickRemoveCanTeach = function(e, levelId) {
        e.preventDefault();
        vm.ioUserTmp.profile.canTeach.splice(vm.ioUserTmp.profile.canTeach.indexOf(levelId), 1);
      };

      vm.onClickOnCareer = function(e) {
        e.preventDefault();

        if (vm.ioUserTmp.profile.onCareers) {
          var alreadyCan = vm.ioUserTmp.profile.onCareers.find(function(item) {
            return item === vm.id_career;
          });
          if (!alreadyCan) {
            vm.ioUserTmp.profile.onCareers.push(vm.id_career);
          }
        } else {
          vm.ioUserTmp.profile.onCareers = [];
          vm.ioUserTmp.profile.onCareers.push(vm.id_career);
        }

        console.log(vm.ioUserTmp.profile.assignedCareer);
      };

      vm.onClickRemoveOnCareer = function(e, careerId) {
        e.preventDefault();
        vm.ioUserTmp.profile.onCareers.splice(vm.ioUserTmp.profile.onCareers.indexOf(careerId), 1);
      };

      vm.onClickBlock = function() {
        ModalSrv.open({
          url: 'modules/capacitation-centers/views/io-user.remove.view.html',
          confirm: function() {
            UsersSrv.delete({
              _id: vm.ioUserTmp._id
            }).then(function() {
              NotificationsSrv.removed();
              $state.go('capacitation-centers');
            }, function(err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onClickUnblock = function() {
        vm.ioUserTmp.enable = true;
        vm.onSubmit();
      };

      vm.onSubmit = function() {
        // if (isTeacher(vm.ioUserTmp.role) && vm.ioUserTmp.profile && (!vm.ioUserTmp.profile.canTeach || !vm.ioUserTmp.profile.canTeach.length)) {
        //   NotificationsSrv.error({
        //     msg: 'Necesitas agregar un curso que pueda dar'
        //   });
        //   return false;
        // }

        UsersSrv.upsert({
          user: vm.ioUserTmp
        }).then(function(ioUser) {
          if (vm.ioUserTmp._id) {
            NotificationsSrv.updated();
            setCurrent(ioUser);
          } else {
            $state.go('io-user', {
              id: ioUser.data._id
            });
            NotificationsSrv.success();
          }
        }, function(err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };
    }
  ]);