
(function() {
    "use strict";

    angular
        .module('app.data')
        .factory('AuthDAL', AuthDAL);

    AuthDAL.$inject = ['$http', 'DataServices'];

    function AuthDAL($http, DataServices) {
        return {

            authenticate: function(creds) {

                return $http.post(DataServices.URLS.AUTH, JSON.stringify(creds));

            }

        };
    }

})();
