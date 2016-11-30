'use strict';


// dni: {
//   type: Number
// },
// email: {
//   type: String,
//   trim: true
// },
// firstName: {
//   type: String,
//   trim: true
// },
// lastName: {
//   type: String,
//   trim: true
// },
// gender: {
//   type: String,
//   trim: true
// },
// bday: {
//   type: Date
// },
// phone: {
//   type: Number
// },
// pass: {
//   type: String,
//   trim: true
// },
// location: {
//   type: String,
//   trim: true
// },
// avatar: {
//   type: String,
//   trim: true
// },
// rol: {
//   type: Number,
//   default: 10
// },
// cartifications: [{
//   title: {
//     type: String,
//     trim: true
//   },
//   number: {
//     type: String,
//     trim: true
//   },
//   byCenter: {
//     type: String,
//     trim: true
//   },
//   date: {
//     type: Date
//   }
// }],
// settings: {},
// notifications: {
//   sleeptime: [{
//     from: {
//       type: Date
//     },
//     to: {
//       type: Date
//     },
//     date: {
//       type: Date
//     }
//   }],
//   unsubscribe: {
//     type: Boolean,
//     default: false
//   }
// }

angular
    .module('users')
    .controller('UserController', ['User', 'UsersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', 'ROLES', '$rootScope',
        function(User, UsersSrv, ModalSrv, $state, $scope, NotificationsSrv, ROLES, $rootScope) {
            var vm = this;
            vm.roles = ROLES;

            vm.geoConfig = {
                types: ['geocode']
            };

            function setCurrent(current) {
                current = current && current.data || {};
                console.log(current);

                vm.userTmp = current;
            }

            setCurrent(User);

            vm.onSubmit = function() {
                UsersSrv.upsert({
                    center: vm.userTmp
                }).then(function(user) {
                    if (vm.userTmp._id) {
                        NotificationsSrv.updated();
                        setCurrent(user);
                    } else {
                        $state.go('capacitation-centers', {
                            id: user.data._id
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