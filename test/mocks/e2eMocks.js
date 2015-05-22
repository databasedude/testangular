
(function(){
    "use strict";

    angular
        .module('mockedApp', ['app', 'ngMockE2E', 'app.data', 'mockData'])
        .run(e2eMocks);

    e2eMocks.$inject = ['$httpBackend', 'DataServices'];

    function e2eMocks($httpBackend, DataServices){

        $httpBackend.whenGET(/^\/index.html\//).passThrough();
        $httpBackend.whenGET(/^\/languages\//).passThrough();
        $httpBackend.whenGET(/^\/fonts\//).passThrough();
        $httpBackend.whenGET(/^\/images\//).passThrough();
        $httpBackend.whenGET(/^\/lib\//).passThrough();
        $httpBackend.whenGET(/^\/scripts\//).passThrough();
        $httpBackend.whenGET(/^\/views\//).passThrough();
        $httpBackend.whenGET(/^\/.*.json\//).passThrough(); // request for language files, etc.


        var scenarios = parseScenarios(mockData);
        createExplicitMockRequests(scenarios);
        createImplicitMockRequests(scenarios);
        createMockAuthRequestsForEachScenario(scenarios);

        function parseScenarios(mockData){
            var scenarios = {};
            // Loop through mock data and group all mock requests by scenario name
            _.each(mockData, function(value, key){
                _.each(value, function(request){
                    if (!scenarios[request.id]){
                        scenarios[request.id] = {};
                    }
                    scenarios[request.id][key] = request;
                });
            });
            return scenarios;
        }

        function createExplicitMockRequests(scenarios){
            // loop through each scenario
            _.each(scenarios, function(configs, scenario_name){

                // loop through each request config of the given scenario
                // and add a mock request to $httpBackend
                _.each(configs, function(config, name){
                    var token = scenario_name;
                    createRequest(config, token);
                });
            });
        }

        function createImplicitMockRequests(scenarios){
            // the "consumption" scenario contains all requests and is the default used
            var consumption_keys = _.keys(scenarios.consumption);

            // loop through each scenario
            _.each(scenarios, function(configs, scenario_name){

                // each scenario needs a full suite of backend requests for the scenario token
                // so find the difference and loop through the missing keys to build a mock request
                // based on the consumption mock requests.
                var scenario_keys   = _.keys(configs),
                    diff_keys       = _.difference(consumption_keys, scenario_keys);
                _.each(diff_keys, function(key){
                    var config = scenarios.consumption[key];
                    if (_.include(config.params, '[token]')){
                        createRequest(config, scenario_name);
                    }
                });

            });
        }

        // each scenario needs a mock request-response in order to login and respond with the proper mock data for the given scenario
        function createMockAuthRequestsForEachScenario(scenarios){
            _.each(scenarios, function(configs, scenario_name){
                createConsumptionUserAuthRequestPersistent(scenario_name);
                createConsumptionUserAuthRequestNonPersistent(scenario_name);
            });

            function createConsumptionUserAuthRequestPersistent(scenario_name){
                $httpBackend.when('POST', DataServices.URLS.AUTH, createParams(scenario_name, true)).respond(getResponse(scenario_name, true));
            }

            function createConsumptionUserAuthRequestNonPersistent(scenario_name){
                $httpBackend.when('POST', DataServices.URLS.AUTH, createParams(scenario_name, false)).respond(getResponse(scenario_name, true));
            }

            function createParams(scenario_name, is_persistent){
                return {
                    "UserName": scenario_name + "@domain.com",
                    "Password": "password",
                    "IsPersistent": is_persistent
                };
            }

            function getResponse(scenario_name, has_monitoring){
                return {
                    "StatusCode": "200",
                    "ResponseMessage": "Success",
                    "Payload": {
                        "tokenID": scenario_name,
                        "expiresInMinutes": 1440
                    }
                };
            }
        }

        function response(item){
            var response = item.response;
            if (item.url.indexOf('/languages/') > -1) return response;
            return function(){
                return [response.status, response.data, response.headers, response.statusText];
            }
        }

        function createRequest(item, token){
            var urls = [],
                url  = buildGetRequestUrl(item, token);

            if (_.contains(urls, url) === false){
                urls.push(url);
                if (item.type == 'GET'){
                    $httpBackend.whenGET(url).respond(response(item));
                }
                if (item.type == 'POST'){
                    var params = getParams(item, token);
                    console.log(params);
                    $httpBackend.when(item.type, getBaseUrl(item), params).respond(response(item));
                }
                if (item.type == 'JSONP'){
                    $httpBackend.whenJSONP(url).respond(response(item));
                }
            }
        }

        function getParams(item, token){
            var params = _.clone(item.params);
            if (params.id === '[token]'){
                params.id = token;
            }
            if (params._id){
                params.id = params._id;
                delete params._id;
            }
            return params;
        }

        function buildGetRequestUrl(item, token) {
            if (!item.params) return getBaseUrl(item);
            var params  = getParams(item, token);
            return getBaseUrl(item) + '?' + decodeURIComponent($.param(params));
        }

        function getBaseUrl(item){
            if (item.url.indexOf('/languages/') > -1) return item.url;
            return DataServices.HOST + item.url.substring(1);
        }


    }

})();
