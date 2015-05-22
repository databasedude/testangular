
(function() {
    "use strict";

    angular
        .module('app')
        .config(routesConfig);

    routesConfig.$inject = ['$urlRouterProvider', '$locationProvider'];

    function routesConfig($urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise("/dashboard");
    }
})();
