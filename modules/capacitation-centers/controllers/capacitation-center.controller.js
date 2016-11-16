'use strict';

angular
  .module('capacitation-centers')
  .controller('CapacitationCenterController', ['CapacitationCenter', 'CapacitationCentersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', 'ROLES', '$rootScope',
    function(CapacitationCenter, CapacitationCentersSrv, ModalSrv, $state, $scope, NotificationsSrv, ROLES, $rootScope) {
      var vm = this;
      vm.roles = ROLES;

      // _id: 2,
      //   user: {},
      //   name: 'Centro de capacitacion 2',
      //   description: 'Damos capacitaciones 2',
      //   url: 'https://www.coderhouse.com',
      //   avatar: 'avatar.jpg',
      //   contact: {
      //     email: 'center@gmail.com',
      //     phone: 44810302
      //   },
      //   location: {
      //     address: {},
      //     hours: {
      //       from: new Date(),
      //       to: new Date()
      //     },
      //     days: {
      //       from: 1,
      //       to: 2
      //     }
      //   },
      //   courses: [{
      //     name: 'Curso de RPC 2',
      //     description: 'Descripcion del curso 2',
      //     url: 'https://www.coderhouse.com',
      //     published: false
      //   }],
      //   enable: false,
      //   published: false

      vm.geoConfig = {
        types: ['geocode']
      };

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);

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

      vm.onSubmit = function() {
        CapacitationCentersSrv.upsert({
          capacitationCenter: vm.capacitationCenterTmp
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