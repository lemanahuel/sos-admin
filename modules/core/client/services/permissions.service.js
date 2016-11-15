'use strict';

angular
  .module('core')
  .service('PermissionsSrv', ['$rootScope',
    function($rootScope) {
      var permissions = {
        admin: {
          admin: true
        },
        creator: {
          creator: true
        },
        reader: {
          reader: true
        }
      };

      return {
        set: function(user) {
          console.log(user);
          if (user) {
            user.rol = parseInt(user.rol, 10);

            switch (user.rol) {
              case 1:
                $rootScope.PERMISSIONS = permissions.admin;
                break;
              case 2:
                $rootScope.PERMISSIONS = permissions.creator;
                break;
              case 3:
                $rootScope.PERMISSIONS = permissions.reader;
                break;
            }
          } else {
            $rootScope.PERMISSIONS = permissions.none;
          }
          console.log(user);
          return $rootScope.PERMISSIONS;
        }
      };
    }
  ]);
