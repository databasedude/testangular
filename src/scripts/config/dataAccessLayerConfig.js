
(function() {
    "use strict";

    angular
        .module('app')
        .config(dataAccessLayerConfig);

    dataAccessLayerConfig.$inject = ['DataServicesProvider'];

    function dataAccessLayerConfig(DataServicesProvider) {

        if (location.hostname === 'localhost') {
            DataServicesProvider.setApiPath('https://some_domain_name.com/');
        } else {
            DataServicesProvider.setApiPath('/');
        }
    }

})();
