'use strict';

angular
  .module('capacitation-centers')
  .controller('CapacitationCenterController', ['CapacitationCenter', 'CapacitationCentersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', 'ROLES', '$rootScope',
    function(CapacitationCenter, CapacitationCentersSrv, ModalSrv, $state, $scope, NotificationsSrv, ROLES, $rootScope) {
      var vm = this;
      vm.roles = ROLES;

      vm.geoConfig = {
        types: ['geocode']
      };

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);

        if (current && current.location && current.location.hours && current.location.hours.from) {
          current.location.hours.from = new Date(current.location.hours.from);
        }

        if (current && current.location && current.location.hours && current.location.hours.to) {
          current.location.hours.to = new Date(current.location.hours.to);
        }

        vm.capacitationCenterTmp = current;
      }

      setCurrent(CapacitationCenter);

      vm.getDays = function(item) {
        var days = DAYS;

        if (item && item.fromDay) {
          if (item.fromDay !== item.toDay) {
            return days[item.fromDay] + ' y ' + days[item.toDay];
          }
          return days[item.fromDay];
        }
      };

      vm.onClickAddCourse = function() {
        vm.capacitationCenterTmp.courses = vm.capacitationCenterTmp.courses || [];
        vm.capacitationCenterTmp.courses.push({});
      };

      vm.onClickRemoveCourse = function(e, index) {
        e.preventDefault();
        e.stopPropagation();

        vm.capacitationCenterTmp.courses.splice(index, 1);
      };

      vm.onSubmit = function() {
        CapacitationCentersSrv.upsert({
          center: vm.capacitationCenterTmp
        }).then(function(capacitationCenter) {
          if (vm.capacitationCenterTmp._id) {
            NotificationsSrv.updated();
            setCurrent(capacitationCenter);
          } else {
            $state.go('capacitation-centers', {
              id: capacitationCenter.data._id
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