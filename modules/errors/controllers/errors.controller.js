'use strict';

angular
  .module('errors')
  .controller('ErrorController', ['Home', 'Status', '$rootScope', 'ListGeneratorsSrv', 'UserWachedSrv', 'AdsSrv', '$document',
    function(Home, Status, $rootScope, ListGeneratorsSrv, UserWachedSrv, AdsSrv, $document) {
      var vm = this,
        list = null,
        home = Home && Home.data ? Home.data : Home;
      vm.status = Status;

      function addRobotTag() {
        var robotsTag = $document[0].createElement('meta');
        robotsTag.id = 'robots-meta-tag';
        robotsTag.name = 'robots';
        robotsTag.content = 'noindex,nofollow';
        $document[0].getElementsByTagName('head')[0].appendChild(robotsTag);
      }

      addRobotTag();

      function setList() {
        switch (Math.floor(Math.random() * (3 - 1) + 1)) {
          case 1:
            list = home.popularVideos;
            break;
          case 2:
            list = home.recentVideos;
            break;
          default:
            list = home.featuredVideos;
            break;
        }

        var pos = list[3] ? 3 : list.length - 1;
        if (pos >= 0) {
          list[pos] = angular.extend(list[pos], AdsSrv.get());
        }

        list = UserWachedSrv.find(list);

        if ($rootScope.IS_MOBILE) {
          vm.videosList = ListGeneratorsSrv.set(list).slice(0, 2);
        } else {
          vm.videosList = [list.slice(0, 4)];
        }
      }

      setList();

      $rootScope.$emit('App:Ads:Add', {
        section: 'home_novivo',
        formats: ['top950x50', 'right_banner2', 'epl_expandable_div', 'epl_div']
      });
      $rootScope.$emit('App:Header:Title:Reset');
      $rootScope.$emit('App:Tracking');
    }
  ]);
