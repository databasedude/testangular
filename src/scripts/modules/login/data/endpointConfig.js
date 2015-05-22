
(function(){
    "use strict";

    angular
        .module('app.data')
        .run(config);

    config.$inject = ['DataServices'];

    function config(DataServices){

        DataServices.addEndpoint('AUTH', 'Authenticate', DataServices.services.AUTHENTICATION);

    }

})();