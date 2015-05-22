/**
 * Created by dlparker on 1/21/15.
 */

(function(){
    "use strict";

    angular
        .module('app')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider'];

    function routesConfig($stateProvider){

        $stateProvider
            .state('login', {
                url: '/login',
                authenticate: false, // user must not be authenticated
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('views/modules/login/login.html');
                }]
            });

    }
})();
