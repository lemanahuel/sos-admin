'use strict';

angular
  .module('users')
  .controller('UsersController', ['Users', 'UsersSrv', 'ModalSrv', '$state',
    function(Users, UsersSrv, ModalSrv, $state) {
      var vm = this;

      function setCurrents(items) {
        vm.users = items && items.data;
        vm.amountOfVolunteers = vm.users.filter(function(item) {
          return item.isVolunteer;
        }).length;
        console.log(vm.users);
      }

      setCurrents(Users);

      vm.onClickOrderBy = function(by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickEdit = function(e, id) {
        e.stopPropagation();
        e.preventDefault();

        $state.go('user', {
          id: id
        });
      };

      vm.onClickRemove = function(e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function(id) {
          vm.user = vm.User.filter(function(item) {
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