'use strict';

angular
  .module('schedules')
  .controller('SchedulesController', ['Schedules', 'SchedulesSrv', '$state', 'ModalSrv', '$rootScope', 'NotificationsSrv',
    function (Schedules, SchedulesSrv, $state, ModalSrv, $rootScope, NotificationsSrv) {
      var vm = this;
      vm.currentOrder = '';

      function parseSchedules(schedules) {
        var items = [];
        var classes = [];
        var camadas = [];
        var matchedClassesId = [];
        var matchedCamadaId = [];
        var today = new Date().getTime();
        //var student = ByStudent && ByStudent.data[0];
        // if ($rootScope.PERMISSIONS.teacher) {
        //   angular.forEach(schedules, function (item) {
        //     if (student.class._id === item.teacher.class._id) {
        //       items.push(item);
        //     }
        //   });
        // } else if ($rootScope.PERMISSIONS.student) {
        //   angular.forEach(schedules, function (item) {
        //     if (student.class._id === item.teacher.class._id && student.teacher._id === item.teacher._id) {
        //       items.push(item);
        //     }
        //   });
        // } else {
        //   items = schedules;
        // }
        angular.forEach(schedules, function (item) {
          if (new Date(item.day).getTime() < today) {
            item.old = true;
            if ($rootScope.PERMISSIONS.admin) {
              return;
            }
          }

          items.push(item);

          if (item.camada) {
            if (!matchedClassesId.length || matchedClassesId.indexOf(item.camada.class._id) === -1) {
              classes.push(item.camada.class);
              matchedClassesId.push(item.camada.class._id);
            }
            if (!matchedCamadaId.length || matchedCamadaId.indexOf(item.camada._id) === -1) {
              camadas.push(item.camada);
              matchedCamadaId.push(item.camada._id);
            }
          }
        });

        vm.camadas = camadas;
        vm.classes = classes;
        vm.schedules = items;
        console.log(schedules);
      }

      parseSchedules(Schedules && Schedules.data);

      vm.onClickOrderBy = function (by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function (e, id) {
        e.stopPropagation();
        e.preventDefault();

        if ($rootScope.PERMISSIONS.admin) {
          $state.go('schedule', {
            camadaId: id
          });
        }
      };

      vm.onClickRemoteLive = function (e, id) {
        e.stopPropagation();
        e.preventDefault();
        $state.go($rootScope.PERMISSIONS.admin ? 'remote' : 'remote-live', {
          scheduleId: id
        });
      };

      vm.onClickRemove = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.schedules,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          for (i = l - 1; i >= 0; i--) {
            item = items[i];
            if (item._id === id) {
              items.splice(i, 1);
            }
          }
        };

        ModalSrv.open({
          url: '/modules/schedules/views/schedule.remove.view.html',
          confirm: function () {
            SchedulesSrv.delete({
              _id: id
            }).then(function () {
              NotificationsSrv.removed();
              findAndRemove(id);
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };
    }
  ]);
