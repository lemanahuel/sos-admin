'use strict';

angular
  .module('testimonies')
  .controller('TestimonyController', ['Testimony', 'TestimoniesSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', 'ROLES', '$rootScope',
    function(Testimony, TestimoniesSrv, ModalSrv, $state, $scope, NotificationsSrv, ROLES, $rootScope) {
      var vm = this;
      vm.roles = ROLES;

      //   type: String,
      //     trim: true
      // },
      // lastname: {
      //   type: String,
      //   trim: true
      // },
      // email: {
      //   type: String,
      //   trim: true
      // },
      // text: {
      //   type: String,
      //   trim: true
      // },

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);

        vm.testimonyTmp = current;
      }

      setCurrent(Testimony);

      vm.onSubmit = function() {
        TestimoniesSrv.upsert({
          testimony: vm.testimonyTmp
        }).then(function(testimony) {
          if (vm.testimonyTmp._id) {
            NotificationsSrv.updated();
            setCurrent(testimony);
          } else {
            $state.go('testimony', {
              id: testimony && testimony.data._id
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