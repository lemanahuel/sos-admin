'use strict';

angular
    .module('users')
    .controller('UsersController', ['Users', 'UsersSrv', 'ModalSrv', '$state',
        function(Users, UsersSrv, ModalSrv, $state) {
            var vm = this;

            function setCurrents(items) {
                vm.User = items && items.data;
                console.log(vm.User)
            }

            setCurrents(Users);

            vm.onClickEdit = function(e, id) {
                e.stopPropagation();
                e.preventDefault();
                $state.go('users', {
                    id: id
                });
            };

            vm.onClickRemove = function(e, id) {
                e.preventDefault();
                e.stopPropagation();

                var findAndRemove = function(id) {
                    vm.User = vm.User.filter(function(item) {
                        return item._id !== id;
                    });
                };

                ModalSrv.open({
                    url: 'modules/users/views/user.remove.view.html',
                    confirm: function() {
                        findAndRemove(id);
                    }
                });
            };
        }
    ]);