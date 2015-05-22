
(function() {
    "use strict";

    angular
        .module('app')
        .run(sendToLogin);

    sendToLogin.$inject = ['$rootScope', '$state'];

    function sendToLogin($rootScope, $state) {
        var isAuthenticated,
            send_to_dashboard = false;

        $rootScope.$on('authenticated', function(evt) {
            isAuthenticated = true;
            if (send_to_dashboard) {
                $state.go("dashboard");
                send_to_dashboard = false;
            }
        });

        $rootScope.$on('unauthenticated', function(evt) {
            isAuthenticated = false;
        });

        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.authenticate)) {
                // If a page requires authentication and a user is not authenticated then redirect to the login page.
                if (toState.authenticate === true && !isAuthenticated) {
                    event.preventDefault();
                    $state.go("login");
                }

                // If a page requires a non-authenticated user and a user is authenticated then redirect to dashboard
                else if (toState.authenticate === false && isAuthenticated) {
                    event.preventDefault();
                    $state.go("dashboard");
                }

                // There are cases where $stateChangeStart fires before the user's token is authenticated.
                // In such cases, the send_to_dashboard flag is set so that as soon as the "authenticated" event fires the user is sent to dashboard.
                // This prevents a user from viewing the menu and other chrome items of an authenticated user on a page that is intended for non-authenticated users.
                else if (toState.authenticate === false && angular.isDefined(isAuthenticated) === false) {
                    send_to_dashboard = true;
                }
            }
            // If "toState.authenticate" is "undefined" then allow both authenticated an unauthenticated users to access the page
        });

    }

})();
