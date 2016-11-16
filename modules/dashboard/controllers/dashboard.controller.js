'use strict';

angular
  .module('dashboard')
  .controller('DashboardController', ['Authenticated', '$scope', '$state', '$rootScope',
    function(Authenticated, $scope, $state, $rootScope) {
      $scope.$state = $state;
      var vm = this;
      $rootScope.PERMISSIONS = $rootScope.PERMISSIONS || {};
      vm.navItems = [{
        title: 'Centros',
        state: 'capacitation-center',
        permissions: true
      }, {
        title: 'Voluntarios',
        state: 'volunteers',
        permissions: true
      }, {
        title: 'Usuarios',
        state: 'users',
        permissions: true
      }];

      vm.isCollapsed = [];
      vm.navItems.forEach(function(element, index, array) {
        vm.isCollapsed[index] = false;
      });

      vm.closeCollapsed = function() {
        vm.isCollapsed.forEach(function(element, index, array) {
          vm.isCollapsed[index] = false;
        });
      }

      vm.onClickCollpase = function(index) {
        if (!vm.isCollapsed[index]) {
          vm.closeCollapsed();
          vm.isCollapsed[index] = true;
        } else {
          vm.closeCollapsed();
        }
      };

      if (!Authenticated) {
        $state.go('login');
        return;
      }

      if ($state.is('login') || $state.is('dashboard')) {
        $state.go('capacitation-centers');
      }
    }
  ]);