'use strict';

angular
  .module('users')
  .controller('UsersController', ['Users', 'Careers', 'Levels', 'UsersSrv', '$state', 'ModalSrv', 'NotificationsSrv', 'ROLES', 'TEACHER_STATUS', 'ACRONIMS', 'ReportsSrv', '$timeout',
    function(Users, Careers, Levels, UsersSrv, $state, ModalSrv, NotificationsSrv, ROLES, TEACHER_STATUS, ACRONIMS, ReportsSrv, $timeout) {
      var vm = this;
      var users = Users && Users.data;
      vm.currentOrder = 'email';
      vm.roles = ROLES;
      vm.careers = Careers && Careers.data;
      vm.levels = Levels && Levels.data;

      vm.teacherStatus = [];
      angular.forEach(TEACHER_STATUS, function(value, key) {
        vm.teacherStatus.push({
          key: key,
          value: value
        });
      });

      function setCurrentState() {
        var state = 'users';
        if ($state.is('io-students')) {
          state = 'Estudiantes';
          vm.isStudents = true;
        } else if ($state.is('io-teachers')) {
          state = 'Profesores';
          vm.isTeachers = true;
        } else {
          state = 'Usuarios';
        }

        vm.currentTitle = state;
        vm.currentState = $state.$current.name;
      }

      setCurrentState();

      function setCurrents() {
        if (vm.isTeachers) {
          users = users.filter(function(item) {
            return item.enable;
          });
        }

        vm.Users = users.map(function(item) {
          item.feedbacks = item.feedbacks || {};
          item.feedbacks.teacher = item.feedbacks.teacher || {};
          item.feedbacks.teacher.rating = item.feedbacks.teacher.rating || 0;
          return item;
        });
      }

      setCurrents(users);

      vm.csv = (function() {
        function getProfileAge(age) {
          if (age) {
            age = new Date().getFullYear() - new Date(age).getFullYear();
            return age > 0 ? age : '';
          }
          return '';
        }

        function getProfileCountry(profile) {
          if (profile.city && angular.isObject(profile.city) && profile.city.formatted_address) {
            return profile.city.formatted_address;
          } else if (profile.country) {
            return profile.country;
          }
          return '';
        }

        function getProfileCamadasCourses(profile) {
          if (profile.certifications && profile.certifications.length) {
            return profile.certifications.map(function(item) {
              return item.class && item.class.name;
            }).toString();
          }
          return '';
        }

        function getProfileCamadasCompleted(user) {
          if (user.camadas && user.camadas.length) {
            return user.camadas.filter(function(item) {
              return item.completed;
            }).map(function(item) {
              return item.class && item.class.name;
            }).toString();
          }
          return '';
        }

        function getProfileCamadasWip(user) {
          if (user.camadas && user.camadas.length) {
            return user.camadas.filter(function(item) {
              return !item.completed;
            }).map(function(item) {
              return item.class && item.class.name;
            }).toString();
          }
          return '';
        }

        return {
          getFileName: function() {
            return 'io-profiles-' + new Date().getTime() + '.csv';
          },
          getHeaders: function() {
            return ['Email', 'Nombre', 'Apellido', 'Sexo', 'Edad', 'Telefono', 'Pais', 'Estudios', 'Objetivo', 'Curso Completo', 'Curso en Progreso'];
          },
          getProfiles: function() {
            return ReportsSrv.getUsers({
              role: $state.is('io-teachers') ? 3 : $state.is('io-students') ? 2 : 0
            }).then(function(users) {
              users = users && users.data;
              users = users.sort(function(a, b) {
                return a.profile.first_name > b.profile.first_name ? 1 : -1;
              });

              return users.map(function(item) {
                item.profile.bday = getProfileAge(item.profile.bday);
                item.profile.country = getProfileCountry(item.profile);
                //item.profile.certificationes = getProfileCertifications(item.profile);
                item.courseCompleted = getProfileCamadasCompleted(item);
                item.courseWip = getProfileCamadasWip(item);

                return {
                  email: item.email,
                  name: item.profile.first_name,
                  surname: item.profile.last_name,
                  gender: item.profile.gender,
                  age: item.profile.bday,
                  phone: item.profile.phone,
                  country: item.profile.country,
                  study: item.profile.study,
                  objective: item.profile.objective,
                  courseCompleted: item.courseCompleted,
                  courseWip: item.courseWip
                };
              });
            });
          }
        };
      }());

      vm.onChangeFilter = function() {
        var items = users;

        if (vm.currentStatus) {
          items = items.filter(function(item) {
            if (parseInt(item.status, 10) === parseInt(vm.currentStatus, 10)) {
              return true;
            }
            return false;
          });
        }

        if (vm.currentLevel) {
          items = items.filter(function(item) {
            if (item.profile && item.profile.canTeach) {
              return item.profile.canTeach.find(function(level) {
                return parseInt(level.id_level, 10) === parseInt(vm.currentLevel, 10);
              });
            }
            return false;
          });
        }

        if (vm.currentCountry) {
          items = items.filter(function(item) {
            if (item.profile && item.profile.city && item.profile.city.address_components) {
              return item.profile.city.address_components.find(function(address) {
                return address.types.indexOf('country') > -1 && address.short_name.toLowerCase() === vm.currentCountry;
              });
            }
            return false;
          });
        }

        vm.Users = items;
      };

      vm.onClickOrderBy = function(by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickExport = function(e) {
        e.preventDefault();
      };

      vm.onClickCopyEmails = function(e) {
        e.preventDefault();
        var $area = document.getElementById('copy-mails');
        if (vm.Users && vm.Users.length) {
          $area.value = vm.Users.map(function(item) {
            return item && item.email;
          }).join(',');
        } else {
          $area.value = '';
        }
        console.log($area.value);
        $area.select();
        document.execCommand('copy');
        $area.value = '';
      };

      vm.getCanTeach = function(canTeach) {
        if (!canTeach) {
          return '';
        }

        return canTeach.map(function(item) {
          return ACRONIMS.byLevel(item.id_level) || item.title;
        }).join(', ');
      };

      vm.getOnCareers = function(onCareers) {
        if (!onCareers) {
          return '';
        }

        return onCareers.map(function(item) {
          return ACRONIMS.byCareer(item.id_career) || item.title;
        }).join(',');
      };

      vm.onClickEdit = function(e, id) {
        e.stopPropagation();
        e.preventDefault();
        $state.go('io-user', {
          id: id
        });
      };

      vm.onClickRemove = function(e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function(id) {
          vm.Users = vm.Users.filter(function(item) {
            return item._id !== id;
          });
          UsersSrv.delete({
            _id: id
          }).then(function() {
            NotificationsSrv.removed();
          }, function(err) {
            NotificationsSrv.error();
            console.debug(err);
          });
        };

        ModalSrv.open({
          url: '/modules/users/views/io-user.remove.view.html',
          confirm: function() {
            findAndRemove(id);
          }
        });
      };
    }
  ]);