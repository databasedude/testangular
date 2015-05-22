
(function(){
    "use strict";

    angular
        .module('app.services')
        .factory('language', language);

    language.$inject = ['$locale'];

    function language($locale){
        var localeIdMap = {
            /*German/Deutsch */
            "de"	: "de",
            "de-at" : "de",
            "de-de"	: "de",
            "de-li"	: "de",
            "de-lu"	: "de",
            "de-ch"	: "de",
            /*English*/
            "en"	: "en-us",
            "en-gb"	: "en-gb",
            "en-us"	: "en-us",
            /*French*/
            "fr"	: "fr-fr",
            "fr-fr"	: "fr-fr",
            "fr-be" : "fr-fr",
            "fr-ca" : "fr-fr",
            "fr-lu" : "fr-fr",
            "fr-ch" : "fr-fr",
            /*Italian*/
            "it"	: "it",
            "it-it" : "it",
            "it-ch" : "it"
        };

        return {
            getLanguageCode: function(){

                var localeId = $locale.id;

                // Default to en
                return (localeId && localeIdMap[localeId.toLowerCase()]) ? localeIdMap[localeId.toLowerCase()] : localeIdMap.en;
            }
        };

    }

})();
