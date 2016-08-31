'use strict';

angular
  .module('core')
  .service('ModalSrv', ['$uibModal',
    function ($uibModal) {
      return {
        open: function (params) {
          var $modal = $uibModal.open({
            size: params.size || 'sm',
            templateUrl: params.url,
            controllerAs: 'vm',
            controller: ['$uibModalInstance', 'Params', function ($uibModalInstance, Params) {
              var vm = this;
              vm.params = Params;
              vm.ok = function () {
                $uibModalInstance.close(vm.params);
              };
              vm.cancel = function (e) {
                if (e) {
                  e.stopPropagation();
                }
                $uibModalInstance.dismiss('cancel');
              };
            }],
            resolve: {
              Params: function () {
                return params.params;
              }
            }
          });

          $modal.result.then(function (args) {
            if (params.confirm) {
              params.confirm(args);
            }
          }, function () {
            if (params.cancel) {
              params.cancel();
            }
          });
        }
      };
    }
  ]);
