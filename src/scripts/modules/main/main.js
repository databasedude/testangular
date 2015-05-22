(function() {
    "use strict";

    angular
        .module('app.directives')
        .directive('spMain', spMain);

    spMain.$inject = ['$templateCache'];

    function spMain($templateCache) {
        return {
            restrict: 'AE',
            template: $templateCache.get('views/modules/main/main.html')
        };
    }
})();
