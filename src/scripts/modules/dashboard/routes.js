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
            .state('dashboard', {
                url: '/dashboard',
                authenticate: true, // user must be authenticated to access this page, see sendToLogin.js
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('views/modules/dashboard/dashboard.html');
                }]
            });

    }
})();
