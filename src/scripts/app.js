(function() {
    "use strict";

    angular.module('app.data', []);

    angular.module('app.constants', []);

    angular.module('app.services', [
        'app.data',
        'app.constants',
        'pascalprecht.translate',
        'ngCookies'
    ]);

    angular.module('app.directives', [
        'app.services'
    ]);

    angular.module('app.controllers', [
        'app.directives'
    ]);

    angular.module('app.filters', []);

    angular.module('app', [
        'ui.router',
        'ui.router',
        'app.filters',
        'app.controllers'
    ]);

})();
