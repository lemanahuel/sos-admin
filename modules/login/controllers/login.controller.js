'use strict';

angular
  .module('login')
  .controller('LoginController', ['$state', 'UsersSrv', 'SessionSrv', 'PermissionsSrv', 'NotificationsSrv', '$timeout', 'auth',
    function($state, UsersSrv, SessionSrv, PermissionsSrv, NotificationsSrv, $timeout, auth) {
      var arr = window.location.href.split('/');
      var host = arr[0] + '//' + arr[2];
      var vm = this;

      auth.signin({
        primaryColor: '#f49717',
        dict: 'es',
        icon: './modules/core/client/img/sos-logo-big.ico',
        closable: false,
        sso: false,
        container: 'widget-container'
      }, function(profile, idToken, accessToken, state, refreshToken) {
        // All good
        console.log(profile, idToken, accessToken, state, refreshToken);
        SessionSrv.set({
          auth_profile: profile,
          token: idToken
        });
        UsersSrv.getByEmail({
          email: profile.email
        }).then(function(User) {
          var user = User && User.data;
          console.log('user', user);
          //teacher && approved
          if (user && user._id) {
            if (user.isAdmin) {
              SessionSrv.set({
                user: user
              });
              PermissionsSrv.set(user);
              SessionSrv.set({
                profile: user.profile
              });
              $state.go('incidents');
            } else {
              NotificationsSrv.error({
                msg: 'No tienes permisos de administrador, contactate con it@voluntariosos.com y lo resolveremos a la brevedad',
                delay: 10000
              });
              $state.reload();
            }
          } else {
            UsersSrv.upsert({
              user: profile
            }).then(function(User) {
              NotificationsSrv.error({
                msg: 'Hubo un problema con tu usuario, contactate con it@voluntariosos.com y lo resolveremos a la brevedad',
                delay: 10000
              });
              $state.reload();
            });
          }
        });
      }, function(error) {
        // Error
      });

      // auth.signin({
      // contianer: 'widget-container',
      //   //callbackURL: host + '/callback',
      //   responseType: 'token',
      //   authParams: {
      //     scope: 'openid profile'
      //   },
      //   primaryColor: '#43c1c2',
      //   dict: 'es',
      //   gravatar: true,
      //   icon: './modules/core/client/img/ch-icon.ico',
      //   closable: false,
      //   sso: false
      // }, function(auth_profile, idToken) {
      // SessionSrv.set({
      //   auth_profile: auth_profile,
      //   token: idToken
      // });
      // UsersSrv.get({
      //   id: auth_profile.identities[0].user_id
      // }).then(function(User) {
      //   var user = User && User.data;
      //   console.log('user', user);
      //   //teacher && approved
      //   if (user && ((user.role !== 3) || (user.role === 3 && user.status === 4))) {
      //     SessionSrv.set({
      //       user: user
      //     });
      //     PermissionsSrv.set(user);

      //     SessionSrv.set({
      //       profile: user.profile
      //     });

      //     $state.go('incidents');
      //   } else {
      //     NotificationsSrv.error({
      //       msg: 'Hubo un problema con tu usuario, contactate con it@coderhouse.com y lo resolveremos a la brevedad',
      //       delay: 10000
      //     });
      //     $state.reload();
      //   }
      //   });
      // }, function(err) {
      //   console.log('e', err);
      // }, 'Auth0');
    }
  ]);