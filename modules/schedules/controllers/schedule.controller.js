'use strict';

angular
  .module('schedules')
  .controller('ScheduleController', ['Schedules', 'Camada', 'Camadas', 'Remotes', 'SchedulesSrv', 'StagesSrv', 'CamadasSrv', 'ModalSrv', 'NotificationsSrv', '$state', '$scope',
    function (Schedules, Camada, Camadas, Remotes, SchedulesSrv, StagesSrv, CamadasSrv, ModalSrv, NotificationsSrv, $state, $scope) {
      var vm = this;
      vm.currentCamada = Camada && Camada.data;
      vm.camadaTmp = Camada && Camada.data;
      vm.camadas = Camadas && Camadas.data;
      vm.remotes = Remotes && Remotes.data;
      vm.datePicker = {
        options: {
          formatYear: 'yyyy',
          startingDay: 1
        },
        format: 'dd MMMM yyyy',
        altInputFormats: ['M!/d!/yyyy'],
        popup: {
          opened: false,
          onClickOpen: function () {
            vm.datePicker.popup.opened = true;
          }
        }
      };

      console.log(vm.remotes);

      function setCurrent(schedules) {
        //vm.stages = current && current.data ? current.data : [];
        //vm.scheduleTmp.day = vm.scheduleTmp.day ? new Date(vm.scheduleTmp.day).getTime() : vm.scheduleTmp.day;
        //vm.scheduleTmp.from = parseTimer(vm.scheduleTmp.from).getTime();
        //vm.scheduleTmp.to = parseTimer(vm.scheduleTmp.to).getTime();
        console.log(vm.scheduleTmp);

        if (vm.camadaTmp && vm.camadaTmp._id) {
          mergeStagesSchedules(vm.camadaTmp.class.stages, schedules && schedules.data);
        }
      }

      setCurrent(Schedules);

      function getDefaultDate(time, start, end) {
        if (time && new Date(time) == 'Invalid Date' && isNaN(time)) {
          time = time.split(':');
          start = time[0];
          end = time[1];
        } else if (time) {
          time = angular.isString(time) && !isNaN(time) ? parseInt(time, 10) : time;
          time = new Date(time);
          start = time.getHours();
          end = time.getMinutes();
        }
        var date = new Date();
        date.setHours(start);
        date.setMinutes(end);
        date.setSeconds(0);
        return date.getTime();
      }

      function getDefaultStartHour(time) {
        return getDefaultDate(time, 18, 30);
      }

      function getDefaultEndHour(time) {
        return getDefaultDate(time, 22, 0);
      }

      function parseTimer(date) {
        if (!date || angular.isString(date)) {
          var tmp = date.split(':');
          date = new Date();
          date.setHours(tmp[0]);
          date.setMinutes(tmp[1]);
          date.setSeconds(0);
        }

        return date;
      }

      function decodeTimer(date) {
        var tmp = [];
        date = date ? new Date(date) : new Date();
        date.getHours();
        date.getMinutes();
        tmp.push(date.getHours(), date.getMinutes(), '00');

        return tmp.join(':');
      }

      function getClassId(camadaId) {
        for (var i = 0, l = vm.camadas.length; i < l; i++) {
          if (vm.camadas[i]._id === camadaId) {
            return vm.camadas[i].class._id;
          }
        }

        return false;
      }

      function mergeStagesSchedules(stages, schedules) {
        var schedule = null;
        var stage = null;

        console.log(stages.length, schedules.length);

        for (var x = 0, le = stages.length; x < le; x++) {
          stage = stages[x];
          for (var i = 0, l = schedules.length; i < l; i++) {
            schedule = schedules[i];
            if (schedule.stage && schedule.stage._id === stage._id) {
              stage.schedule = schedule;
            }
          }

          if (!stage.schedule) {
            if (stage.name === 'TP Inicial' || stage.name === 'Bienvenida' || stage.name === 'Programa' || stage.name === 'Curso 1: GitHub y HTML5') {
              stage.schedule = schedules[0] || {};
            } else {
              stage.schedule = schedules[x] || {};
            }
            stage.schedule.class = angular.isString(stage.class) ? stage.class : stage.class._id;
            stage.schedule.camada = vm.currentCamada ? vm.currentCamada._id : vm.camadaTmp._id;
            stage.schedule.stage = stage._id;
          }

          console.log();

          stage.schedule.day = stage.schedule.day ? new Date(stage.schedule.day) : new Date();
          stage.schedule.from = getDefaultStartHour(stage.schedule.from);
          stage.schedule.to = getDefaultEndHour(stage.schedule.to);
        }
        console.log(stages);
        vm.stages = stages;
      }

      function getSchedulesByCamada(camadaId) {
        CamadasSrv.get({
          _id: camadaId
        }).then(function (camada) {
          vm.currentCamada = camada && camada.data;
          SchedulesSrv.get({
            camadaId: vm.currentCamada._id
          }).then(function (schedules) {
            mergeStagesSchedules(vm.currentCamada.class.stages, schedules && schedules.data);
          }, function (err) {
            console.log(err);
          });
        }, function (err) {
          console.log(err);
        });
      }

      $scope.$watch('vm.camadaId', function (camadaId) {
        if (camadaId) {
          getSchedulesByCamada(camadaId);
        }
      });

      function updateStage(schedule) {
        var items = vm.stages,
          item = null;

        for (var i = 0, l = items.length; i < l; i++) {
          if (items[i]._id === schedule.stage) {
            items[i].schedule._id = schedule._id;
          }
        }
      }

      vm.onClickShowHolidays = function (e) {
        e.preventDefault();
        ModalSrv.open({
          url: 'modules/schedules/views/schedule.holidays.view.html'
        });
      };

      vm.onClickRemove = function () {
        ModalSrv.open({
          url: 'modules/schedules/views/schedule.remove.view.html',
          confirm: function () {
            SchedulesSrv.delete({
              _id: vm.scheduleTmp._id
            }).then(function () {
              NotificationsSrv.removed();
              $state.go('schedules');
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      function normalizeDate(day, time) {
        var date = new Date(day);
        time = new Date(time);
        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());
        return date.getTime();
      }

      function setScheduleObj(stage) {
        var day = new Date(stage.schedule.day).getTime();
        var obj = {
          day: day,
          from: normalizeDate(day, stage.schedule.from),
          to: normalizeDate(day, stage.schedule.to),
          camada: vm.camadaTmp && vm.camadaTmp._id ? vm.camadaTmp._id : vm.currentCamada._id,
          remoteUrl: stage.schedule.remoteUrl,
          stage: stage._id
        };

        if (stage.schedule && stage.schedule._id) {
          obj._id = stage.schedule._id;
        }
        console.log(obj);
        return obj;
      }

      function saveDate(stage, cb) {
        SchedulesSrv.upsert({
          schedule: setScheduleObj(stage)
        }).then(function (schedule) {
          updateStage(schedule && schedule.data);
          if (cb) {
            return cb();
          }
          NotificationsSrv.updated();
          return true;
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
          if (cb) {
            return cb(err);
          }
          return true;
        });
      }

      vm.onClickSaveDate = function (e, stage) {
        saveDate(stage);
      };

      vm.onSubmit = function () {
        // var obj = {
        //   _id: vm.scheduleTmp._id,
        //   day: vm.scheduleTmp.day,
        //   from: decodeTimer(vm.scheduleTmp.from),
        //   to: decodeTimer(vm.scheduleTmp.to),
        //   camada: vm.scheduleTmp.camada._id
        // };
        //
        // if (vm.scheduleTmp.camada.type === 'remote') {
        //   obj.remote = vm.scheduleTmp.remote._id;
        // }

        var count = vm.stages.length;
        angular.forEach(vm.stages, function (stage) {
          saveDate(stage, function (err) {
            if (err) {
              console.log(err);
            }
            count--;
            if (!count) {
              NotificationsSrv.updated();
            }
          });
        });
      };
    }
  ]);
