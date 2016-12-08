'use strict';

angular
  .module('testimonies')
  .controller('TestimonyController', ['Testimony', 'TestimoniesSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', '$rootScope',
    function(Testimony, TestimoniesSrv, ModalSrv, $state, $scope, NotificationsSrv, $rootScope) {
      var vm = this;

      function setCurrent(current) {
        current = current && current.data || {};
        console.log(current);

        vm.testimonyTmp = current;
      }

      setCurrent(Testimony);

      vm.onClickDelete = function() {
        ModalSrv.open({
          url: 'modules/testimonies/views/testimony.remove.view.html',
          confirm: function() {
            TestimoniesSrv.delete({
              _id: vm.testimonyTmp._id
            }).then(function() {
              NotificationsSrv.removed();
              $state.go('testimonies');
            }, function(err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

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