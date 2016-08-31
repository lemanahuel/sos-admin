'use strict';

angular
  .module('core')
  .service('PermissionsSrv', ['$rootScope',
    function ($rootScope) {
      var permissions = {
        admin: {
          admin: true,
          remote: true,
          sections: {
            classes: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            stages: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            modules: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            schedules: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            profiles: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            students: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            teachers: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            tps: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            users: {
              create: true,
              read: true,
              update: true,
              delete: true
            }
          }
        },
        teacher: {
          teacher: true,
          sections: {
            classes: {
              read: true,
              update: true,
              delete: false
            },
            stages: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            modules: {
              create: true,
              read: true,
              update: true,
              delete: true
            },
            schedules: {
              read: true,
              update: true,
              delete: true
            },
            profiles: {
              read: true
            },
            students: {
              read: true
            },
            tps: {
              read: true,
              update: true
            }
          }
        },
        student: {
          student: true,
          sections: {
            classes: {
              read: true
            },
            stages: {
              read: true
            },
            modules: {
              read: true
            },
            schedules: {
              read: true
            },
            profiles: {
              read: true,
              update: true
            },
            tps: {
              create: true,
              read: true,
              update: true,
              delete: true
            }
          }
        },
        free: {
          free: true,
          sections: {
            classes: {
              read: true
            },
            profiles: {
              read: true,
              update: true
            }
          }
        }
      };

      function belongsToRemote(user) {
        var bool = false;

        angular.forEach($rootScope.PERMISSIONS.student ? user.students : user.teachers, function (item) {
          if (item && item.camada && item.camada.type === 'remote') {
            bool = true;
          }
        });

        console.log(bool);

        return bool;
      }

      return {
        set: function (user) {
          if (user && user.role) {
            user.role = parseInt(user.role, 10);
          }

          // $httpProvider.defaults.headers.common['rol'] = user.role;
          // $httpProvider.defaults.headers.common['id'] = user._id;

          if (user) {
            switch (user.role) {
            case 1:
              $rootScope.PERMISSIONS = permissions.admin;
              break;
            case 2:
              $rootScope.PERMISSIONS = permissions.student;
              $rootScope.PERMISSIONS.remote = belongsToRemote(user);
              break;
            case 3:
              $rootScope.PERMISSIONS = permissions.teacher;
              $rootScope.PERMISSIONS.remote = belongsToRemote(user);
              break;
            case 10:
              $rootScope.PERMISSIONS = permissions.free;
              break;
            }
          } else {
            $rootScope.PERMISSIONS = permissions.none;
          }
          console.log(user);
          return $rootScope.PERMISSIONS;
        }
      };
    }
  ]);
