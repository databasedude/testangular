
(function() {
    "use strict";

    angular
        .module('app.controllers')
        .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['AuthData', '$rootScope', '$state', '$translate'];

    function LoginFormController(AuthData, $rootScope, $state, $translate) {
        var vm = this;
        vm.login = login;
        vm.user = { IsPersistent: false };

        function login(){
            if (vm.user && vm.user.UserName && vm.user.Password) {

                AuthData.authenticate(vm.user)
                    .success(function(data, status, headers, config) {
                        $rootScope.$emit('authenticated');
                        $state.go('dashboard');
                    })
                    .error(function(err, status){
                        $translate(err.code).then(
                            function onSuccess(translation){
                                vm.error = translation;
                            }
                        );
                    });
            }
        }

    }

})();
