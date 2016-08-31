'use strict';

angular
  .module('dashboard')
  .controller('DashboardController', ['$scope', '$state', '$rootScope', 'ProfilesSrv',
    function ($scope, $state, $rootScope, ProfilesSrv) {
      var vm = this;
      vm.user = $rootScope.USER;
      vm.profile = $rootScope.PROFILE || $rootScope.AUTH_PROFILE;
      $scope.$state = $state;

      if (vm.profile.avatar) {
        vm.currentPicture = vm.profile.avatar;
      } else if ($rootScope.AUTH_PROFILE.picture) {
        vm.currentPicture = $rootScope.AUTH_PROFILE.picture;
      } else {
        vm.currentPicture = 'modules/core/client/img/ch-icon.ico';
      }

      (function () {
        var qs, js, q, s, d = document,
          gi = d.getElementById,
          ce = d.createElement,
          gt = d.getElementsByTagName,
          id = 'typef_orm',
          b = 'https://s3-eu-west-1.amazonaws.com/share.typeform.com/';
        if (!gi.call(d, id)) {
          js = ce.call(d, 'script');
          js.id = id;
          js.src = b + 'share.js';
          q = gt.call(d, 'script')[0];
          q.parentNode.insertBefore(js, q);
        }
        id = id + '_';
        if (!gi.call(d, id)) {
          qs = ce.call(d, 'link');
          qs.rel = 'stylesheet';
          qs.id = id;
          qs.href = b + 'share-button.css';
          s = gt.call(d, 'head')[0];
          s.appendChild(qs, s);
        }
      })();
    }
  ]);
