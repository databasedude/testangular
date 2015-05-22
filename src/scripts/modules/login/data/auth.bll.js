/**
 * Created by dlparker on 1/17/15.
 */

(function(){
    "use strict";

    angular
        .module('app.data')
        .factory('AuthData', AuthData);

    AuthData.$inject = ['AuthDAL'];

    function AuthData(AuthDAL){
        return {
            // Pass-through but can override to add business logic as needed
            authenticate:  AuthDAL.authenticate
        };
    }

})();