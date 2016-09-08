'use strict';

angular
  .module('login')
  .controller('LoginController', ['$scope', 'auth', '$state', '$timeout', 'UsersSrv', 'SessionSrv', 'PermissionsSrv', 'NotificationsSrv', 'ProfilesSrv', 'ROLES',
    function ($scope, auth, $state, $timeout, UsersSrv, SessionSrv, PermissionsSrv, NotificationsSrv, ProfilesSrv, ROLES) {
      var arr = window.location.href.split('/');
      var host = arr[0] + '//' + arr[2];

      auth.signup({
        contianer: 'widget-container',
        //callbackURL: host + '/callback',
        responseType: 'token',
        authParams: {
          scope: 'openid profile'
        },
        primaryColor: '#43c1c2',
        dict: 'es',
        gravatar: true,
        icon: './modules/core/client/img/sos-icon.ico',
        closable: false,
        sso: false
      }, function (auth_profile, idToken) {
        SessionSrv.set({
          auth_profile: auth_profile,
          token: idToken
        });
        UsersSrv.get({
          id: auth_profile.identities[0].user_id
        }).then(function (User) {
          var user = User && User.data;
          console.log('user', user);
          if (user) {
            SessionSrv.set({
              user: user
            });
            PermissionsSrv.set(user);

            SessionSrv.set({
              profile: user.profile
            });

            $timeout(function () {
              var verificateProfile = function (user) {
                var profile = user.profile;
                return (profile && profile.first_name && profile.last_name && profile.phone && profile.gender && profile.city);
              };
              if ((user.role == 2 || user.role == 3) && !verificateProfile(user)) {
                $state.go('profile-required', {
                  userId: user._id
                });
              } else {
                $state.go('profile', {
                  userId: user._id
                });
              }
            });
          } else {
            NotificationsSrv.error({
              msg: 'Hubo un problema con tu usuario, contactate con hola@coderhouse.com y lo resolveremos a la brevedad',
              delay: 10000
            });
            $state.reload();
          }
        });
      }, function (err) {
        console.log('e', err);
      }, 'Auth0');
    }
  ]);
