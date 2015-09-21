(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    function ProfileController(user, UsersService, $state) {

        var vm = this;

        angular.extend(vm, {
            user: user,
            userRole: UsersService.getUserRole(vm.user),
            uploadPhoto: uploadPhoto,
            updateUser: updateUser,
            userData: userData()
        });

        function updateUser(){
            var userImage = vm.file;
            if(userImage){
                UsersService.uploadImage(userImage).then(function(filename){
                    vm.user.imageURL = '/images/users/' + filename;

                    UsersService.updateUser(vm.user).then(function () {
                        vm.message = 'Your profile is successfully updated.';
                    });
                })
            } else {
                UsersService.updateUser(vm.user).then(function () {
                    vm.message = 'Your profile is successfully updated.';
                });
            }
        }

        function uploadPhoto(){
            var userImage = vm.file;
            UsersService.uploadImage(userImage).then(function(response){
                return UsersService.generateURL(response);
            }).then(function(response){
                vm.user.imageURL = response;
                UsersService.updateUser(vm.user);

                $state.reload();
            })
        }

        function userData(){
            return UsersService.getUserData(user._id).success(function (response) {
                vm.user.imageURL = response.image;
            });
        }
    }
})();