
(function() {
    "use strict";

    angular
        .module('app')
        .config(translationConfig)
        .run(languageToUse);

    translationConfig.$inject = ['$translateProvider'];

    function translationConfig($translateProvider) {
        //Register a loader for the static files
        //So, the module will search missing translation tables under the specified urls.
        //Those urls are [prefix][langKey][suffix].
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });

        // Tell the module what language to use by default
        $translateProvider.preferredLanguage('en-us');

        // Tell the module to store the language in the local storage
        $translateProvider.useLocalStorage();

        // Enable escaping of HTML
        $translateProvider.useSanitizeValueStrategy('escaped');
    }

    languageToUse.$inject = ['$translate', 'language'];

    function languageToUse($translate, language) {
        $translate.use(language.getLanguageCode());
    }

})();
