
(function(){

    angular
        .module('app.data')
        .provider('DataServices', DataServices);

    DataServices.$inject = [];

    function DataServices(){
        var api_path = 'http://some-domain.com/';

        this.setApiPath = function(path) {
            api_path = path;
        };

        var services = {
            AUTHENTICATION  : 'Auth/Authentication.svc/',
            CUSTOMER_INFO   : 'CustomerInfo/CustomerInfo.svc/'
        };

        var getURL = function(service, method){
            return api_path + service + method;
        };


        this.$get = function(){
            return {
                HOST: api_path,

                // Object where new endpoints are added
                URLS: {},

                services: services,

                addEndpoint: function(name, endpoint, service){
                    this.URLS[name] = getURL(service, endpoint);
                }
            };
        };
    }

})();
