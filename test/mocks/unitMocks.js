
(function(){
    "use strict";

    angular
        .module('mockData', [])
        .factory('unitMocks', unitMocks);

    unitMocks.$inject = ['$httpBackend', 'DataServices'];

    function unitMocks($httpBackend, DataServices){
        var obj = {
            expect: {}
        };

        function checkIfScenarioExists(key){
            if (!mockData[key]){
                throw key + ' not found in mockData';
            }
        }

        function getConfig(scenario, key){
            checkIfScenarioExists(key);
            var config,
                id = scenario || 'default';
            try {
                config = mockData[key][id];
            } catch(e) {
                throw id + ' not found in mockData[' + key + ']';
            }
            if (!config){
                config = mockData[key]['default'];
            }
            return config;
        }

        _.each(_.keys(mockData), function(key){
            obj.expect[key] = function buildMockRequest(scenario, backend){
                var config = getConfig(scenario, key);
                var clone = _.cloneDeep(config);
                clone.token = scenario;
                createExpectation(backend || $httpBackend, clone);
            };

            obj[key] = {
                getResponse:  function(scenario){
                    return getConfig(scenario, key).response;
                },
                getScenario: function(scenario){
                    return getConfig(scenario, key);
                }
            }
        });

        function response(item){
            var response = item.response;
            if (item.url.indexOf('/languages/') > -1) return response;
            return function(){
                return [response.status, response.data, response.headers, response.statusText];
            }
        }


        function createExpectation($httpBackend, item){

            if (item.type == 'GET'){
                var url = buildGetRequestUrl(item);
                $httpBackend.expectGET(url).respond(response(item));
            }
            if (item.type == 'POST'){
                var params = getParams(item);
                $httpBackend.expectPOST(getBaseUrl(item), params).respond(response(item));
            }
            if (item.type == 'JSONP'){
                $httpBackend.expectJSONP(function() {
                    var url = getBaseUrl(item);
                    var params = getParams(item);
                    var delim = '?';
                    //Build URL with parameters
                    for (var prop in params) {
                        if (!params.hasOwnProperty(prop)) { continue; }

                        url += delim + params[prop];
                        delim = '&';
                    }
                    return url;
                }).respond(response(item));
            }
        }

        function getParams(item){
            var params = _.clone(item.params);
            if (params.id === '[token]'){
                params.id = item.token;
            }
            if (params._id){
                params.id = params._id;
                delete params._id;
            }
            return params;
        }

        function buildGetRequestUrl(item){
            if (!item.params) return getBaseUrl(item);
            var params  = getParams(item);
            return getBaseUrl(item) + '?' + decodeURIComponent($.param(params));
        }

        function getBaseUrl(item){
            if (item.url.indexOf('/languages/') > -1) return item.url;
            return DataServices.HOST + item.url.substring(1)
        }

        return obj;
    }

})();