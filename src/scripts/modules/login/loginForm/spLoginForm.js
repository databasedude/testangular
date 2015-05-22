
(function(){
    "use strict";

    angular
        .module('app.directives')
        .directive('spLoginForm', spLoginForm);

    spLoginForm.$inject = ['$templateCache'];

    function spLoginForm($templateCache){
        return {
            restrict: 'A',
            replace: true,
            template: $templateCache.get('views/modules/login/loginForm/loginForm.html'),
            controller: 'LoginFormController',
            controllerAs: 'login'
        };
    }

})();