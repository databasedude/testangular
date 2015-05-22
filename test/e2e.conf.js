
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine2',

    onPrepare: function(){
        var SpecReporter = require('jasmine-spec-reporter');
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));
    },

    jasmineNodeOpts: {
        showColors: true, // Use colors in the command line report.
        print: function() {}
    }
};
