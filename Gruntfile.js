module.exports = function(grunt){

    if (/-*h{1}(elp)*/.test(process.argv[2])) {
        grunt.log.writeln("\n\x1b[1m\x1b[4m app Grunt usage:\x1b[0m\n");
        grunt.log.writeln("\x1b[36;1m  grunt \x1b[33;1m<task> \x1b[35;1m[parameters...]\x1b[0m");

        grunt.log.writeln("\n\x1b[33;1m Tasks\x1b[0m may be one of:");
        grunt.log.writeln("  build     : regular build");
        grunt.log.writeln("  dev-build : development build");
        grunt.log.writeln("  dev       : run dev server");
        grunt.log.writeln("  prod      : run production server");
        grunt.log.writeln("  e2e       : run end-to-end tests");
        grunt.log.writeln("  deploy    : create deployment files");

        grunt.log.writeln("\n\x1b[35;1m Parameters\x1b[0m may include:");
        grunt.log.writeln("  --browsers=[options] : Chrome (default), Firefox, Safari, PhantomJS, etc.");
        grunt.log.writeln("                         Karma unit tests default to Chrome for all_reports,");
        grunt.log.writeln("                         PhantomJS anything else.");
        grunt.log.writeln("                         May be a comma separated list.");
        grunt.log.writeln("  --karma=[options]    : select which karma unit tests to run. Options:");
        grunt.log.writeln("                        \x1b[36;1m all_reports\x1b[0m or\x1b[36;1m true\x1b[0m (default) - produces reports");
        grunt.log.writeln("                        \x1b[36;1m all\x1b[0m - all tests without reports");
        grunt.log.writeln("                        \x1b[36;1m none\x1b[0m or\x1b[36;1m false\x1b[0m - disable unit tests");
        grunt.log.writeln("                        \x1b[36;1m <test_names>\x1b[0m - run tests in directory <test_names>,");
        grunt.log.writeln("                                        a comma separated list of test dirs.");
        grunt.log.writeln("  --loglevel=[option]  : karma log level (\x1b[36;1mDEBUG\x1b[0m or \x1b[36;1mERROR\x1b[0m).");
        grunt.log.writeln("                         Default is ERROR.");
        grunt.log.writeln("  --eetests=[options]  : select which end-to-end tests to run. Options:");
        grunt.log.writeln("                        \x1b[36;1m all\x1b[0m - all E2E tests");
        grunt.log.writeln("                        \x1b[36;1m none\x1b[0m or\x1b[36;1m false\x1b[0m - disable E2E tests");
        grunt.log.writeln("                        \x1b[36;1m <test_names>\x1b[0m - run tests in directory <test_names>,");
        grunt.log.writeln("                                        a comma separated list of test dirs.");
        grunt.log.writeln("  --submodule=[option] : Pull git submodule (default\x1b[36;1m true\x1b[0m)");
        grunt.log.writeln("  --mock[=true]        : use mock data.\x1b[31;1m This must be the final parameter\x1b[0m");
        grunt.log.writeln("                         unless a value is given e.g. mock=true");

        grunt.log.writeln("\n\x1b[1m Examples:\x1b[0m");
        grunt.log.writeln("  grunt\x1b[33;1m build\x1b[0m");
        grunt.log.writeln("  grunt\x1b[33;1m dev\x1b[0m");
        grunt.log.writeln("  grunt\x1b[33;1m dev\x1b[35;1m --karma=login,menu\x1b[0m");
        grunt.log.writeln("  grunt\x1b[33;1m dev\x1b[35;1m --mock\x1b[0m");
        grunt.log.writeln("  grunt\x1b[33;1m e2e\x1b[35;1m --karma=false --eetests=graphs,profile --mock\x1b[0m");
        process.exit(0);
    }

    require('load-grunt-tasks')(grunt, {pattern: 'grunt-*'});

    var rewrite         = require('connect-modrewrite'),
        dataSource      = grunt.option('mock') || grunt.option('mocks'),
        browsers        = grunt.option('browsers'),
        log_level       = grunt.option('loglevel'),
        karma_tests     = grunt.option('karma'),
        e2etests        = grunt.option('eetests') || "all",
        buildDateTime   = grunt.template.today('mmddyyyyhhMMss');

    dataSource = dataSource? 'mockLocal' : 'devLocal';
    log_level = log_level? log_level: "ERROR";

    grunt.registerTask('build', [
        'clean:dev',
        'clean:prod',
        'language:english',
        'mocks',
        'copy:lib',
        'copy:mocks',
        'htmlmin',
        'ngtemplates',
        'copy:templates',
        'karmatests:' + karma_tests,
        'clean:mocks',
        'concat:libs',
        'concat:src',
        'jshint',
        'uglify:libs',
        'uglify:src',
        'concat:app',
        'sass:prod',
        'replace:dist',
        'copy:prod',
        'scriptinject:web',
        'replace:webDist'
    ]);

    grunt.registerTask('dev-build', [
        'clean:dev',
        'language:english',
        'mocks',
        'jshint',
        'copy:lib',
        'copy:mocks',
        'copy:index',
        'htmlmin',
        'ngtemplates',
        'copy:templates',
        'karmatests:' + karma_tests,
        'replace:local',
        'replace:' + dataSource,
        'scriptinject:dev'
    ]);

    grunt.registerTask('dev', [
        'dev-build',
        'sass:dev',
        'connect:server',
        'watch'
    ]);

    var dep_files = [
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/angular/angular.min.js",
        "bower_components/angular/angular.min.js.map",
        "bower_components/angular-cookies/angular-cookies.min.js",
        "bower_components/angular-cookies/angular-cookies.min.js.map",
        "bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "bower_components/lodash/lodash.min.js",
        "bower_components/async/lib/async.js",
        "bower_components/foundation/js/foundation.min.js",
        "bower_components/angular-translate/angular-translate.min.js",
        "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
        "bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
        "bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js",
        "bower_components/angular-mocks/angular-mocks.js"  // this is only included in dev
    ];

    var lib_files = [
        "src/lib/jquery.min.js",
        "src/lib/angular.min.js",
        "src/lib/angular-cookies.min.js",
        "src/lib/angular-ui-router.min.js",
        "src/lib/lodash.min.js",
        "src/lib/async.js",
        "src/lib/foundation.min.js",
        "src/lib/angular-translate.min.js",
        "src/lib/angular-translate-loader-static-files.min.js",
        "src/lib/angular-translate-storage-cookie.min.js",
        "src/lib/angular-translate-storage-local.min.js"
    ];

    var src_files = grunt.file.expand([
        "src/scripts/app.js",
        "src/scripts/config/**/*.js",
        "src/scripts/modules/**/*.js",
        "src/scripts/directives/**/*.js",
        "src/scripts/filters/**/*.js",
        "src/scripts/helpers/**/*.js",
        "src/scripts/languages/**/*.js",
        "src/scripts/services/**/*.js",
        "!**/*.spec.js",
        "!**/*.e2e.js",
        "!**/*.po.js"
    ]);

    //find all scss files mixed-in with js and insert into _modules.scss
    grunt.file.write('scss/_modules.scss', function() {
        var str = '';
        var aux = grunt.file.expand(['src/scripts/**/*.scss']);
        var auxLength = aux.length;
        for (var j = 0; j < auxLength; j++) {
            str += '@import "../' + aux[j].replace('.scss', '').replace('/_', '/') + '";\n';
        }
        return str;
    }());

    var dev_files = []
        .concat(lib_files)
        .concat(src_files)
        .concat('src/scripts/app.templates.js')
        .concat("src/lib/angular-mocks.js")
        .concat('src/mocks/*.js');

    var prod_files = []
        .concat(src_files)
        .concat('<%= ngtemplates.app.dest %>');

    var sharedValues = {
        faviconLink: '<link rel="shortcut icon" href="images/favicon.ico?bust=v' + buildDateTime + '" type="image/icon"/>' +
        '<link rel="icon" href="images/favicon.ico?bust=v' + buildDateTime + '" type="image/icon"/>',
        faviconLinkSlash: '<link rel="shortcut icon" href="/images/favicon.ico?bust=v' + buildDateTime + '" type="image/icon"/>' +
        '<link rel="icon" href="/images/favicon.ico?bust=v' + buildDateTime + '" type="image/icon"/>',
        cssLink: '<link href="css/app.css?bust=v' + buildDateTime + '" rel="stylesheet" type="text/css"/>',
        cssLinkSlash: '<link href="/css/app.css?bust=v' + buildDateTime + '" rel="stylesheet" type="text/css"/>'
    };

    grunt.registerTask('karmatests', 'Karma unit tests', function(unitTests) {
        var unitTestsBrowsers = "PhantomJS";
        var unitTestsArray = [];
        switch(unitTests) {
            case "false":
            case "no":
            case "none":
                grunt.log.writeln("====================================================================");
                grunt.log.writeln("====================================================================");
                grunt.log.writeln("    WARNING: Not running Karma unit tests.");
                grunt.log.writeln("====================================================================");
                grunt.log.writeln("====================================================================");
                return;
            case "yes":
            case "true":
            case "undefined":
            case "all_reports":
                unitTestsArray.push("src/scripts/**/*.spec.js");
                unitTests = "all_reports"; //default
                unitTestsBrowsers = typeof(browsers) === "undefined"? "Chrome": browsers;
                break;
            case "all":
                unitTestsArray.push("src/scripts/**/*.spec.js");
                unitTests = "all_noreports";
                unitTestsBrowsers = typeof(browsers) === "undefined"? "PhantomJS": browsers;
                break;
            default:
                unitTestsArray = findTestDirs(unitTests, "src/scripts/**/", "spec");
                unitTests = "selected";
                unitTestsBrowsers = typeof(browsers) === "undefined"? "PhantomJS": browsers;
                break;
        }
        //Print tests array for debugging
        grunt.log.writeln("Running unit tests on "+ unitTestsBrowsers);
        prettyPrintArray(unitTestsArray);

        unitTestsArray = dev_files.concat(grunt.file.expand(unitTestsArray));
        var unitBrowsersArray = unitTestsBrowsers.split(',');
        grunt.config.set('unitTestsArray', unitTestsArray);
        grunt.config.set('unitBrowsersArray', unitBrowsersArray);
        grunt.config.set('logLevel', log_level);
        grunt.task.run('karma:'+ unitTests);
    });

    grunt.registerTask('protractor-tests', 'Protractor E2E tests', function(ptests) {
        var e2eTestsArray = [];
        switch(ptests) {
            case "false":
            case "no":
            case "none":
                grunt.log.writeln("====================================================================");
                grunt.log.writeln("====================================================================");
                grunt.log.writeln("    WARNING: Not running E2E tests.");
                grunt.log.writeln("====================================================================");
                grunt.log.writeln("====================================================================");
                return;
            case "all":
                e2eTestsArray.push('src/**/*.e2e.js');
                break;
            default:
                e2eTestsArray = findTestDirs(ptests, "src/scripts/**/", "e2e");
                break;
        }
        browsers = typeof(browsers) === "undefined"? "chrome": browsers.toLowerCase();
        //Note: multiCapabilities is not yet passed on by grunt-protractor-runner
        //https://github.com/teerapap/grunt-protractor-runner/pull/62
        //var browsersArray = browsers.split(',');
        //var e2eBrowsersArray = [];
        //for(var i=0; i<browsersArray.length; i++) {
        //    e2eBrowsersArray.push({'browserName': browsersArray[i]});
        //}

        //Print tests array for debugging
        grunt.log.writeln("Running E2E tests on "+ browsers);
        prettyPrintArray(e2eTestsArray);
        grunt.config.set('e2eTestsArray', e2eTestsArray);
        grunt.config.set('e2eBrowser', browsers);
        //grunt.config.set('e2eBrowsersArray', e2eBrowsersArray);
        grunt.task.run('protractor:e2e');
    });

    grunt.registerTask('e2e', [
        'dev-build',
        'sass:dev',
        'connect:server',
        'protractor_webdriver:dev',
        'protractor-tests:' + e2etests
    ]);

    grunt.initConfig({

        mocks: {
            dev: {
                src: 'src/**/*.mock.json',
                dest: 'build/mockData.js'
            }
        },

        concat: {
            src: {
                src: prod_files,
                dest: 'build/src.js'
            },
            libs: {
                src: lib_files,
                dest: 'build/libs.js'
            },
            app: {
                src: ['build/libs.min.js', 'build/src.min.js'],
                dest: 'build/app.min.js'
            }
        },

        ngtemplates:  {
            app:        {
                cwd:      'build',
                src:      ['**/**.html'],
                dest:     'build/app.templates.js'
            }
        },

        htmlmin: {
            multiple: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/scripts/',  // Project root
                        src: '**/*.html',
                        dest: 'build/views/'
                    }
                ]
            }
        },

        language: {
            english: {
                options: {
                    dest: 'src/languages/en-us.json'
                },
                files: [
                    {
                        cwd: 'src/',
                        src: '**/en-us.lang.json'
                    }
                ]
            }
        },

        jshint: {
            beforeconcat: src_files,
            afterconcat: ['build/src.js']
        },

        uglify: {
            src: {
                options : {
                    beautify : false,
                    mangle: true,
                    properties: false
                },
                files: {
                    'build/src.min.js': 'build/src.js'
                }
            },
            libs: {
                options : {
                    beautify : false,
                    mangle: false
                },
                files: {
                    'build/libs.min.js': 'build/libs.js'
                }
            }
        },

        watch: {
            scripts: {
                files: [
                    "src/scripts/**/*.js",
                    "!src/scripts/app.templates.js"
                ],
                tasks: [
                    'clean:js',
                    'copy:lib',
                    'karmatests:' + karma_tests,
                    'scriptinject:dev']
            },
            mocks: {
                files: [
                    "src/**/*.mock.json"
                ],
                tasks: [
                    'dev-build'
                ]
            },
            resources: {
                files:[
                    "src/**/*.html",
                    "src/languages/*.json",
                    "src/fonts/*.*",
                    "src/icons/*.*",
                    "src/images/**/*.*",
                    "!src/index.html"
                ],
                tasks: [
                    'copy:lib',
                    'htmlmin',
                    'ngtemplates',
                    'copy:templates',
                    'karmatests:' + karma_tests,
                    'replace:local',
                    'replace:' + dataSource,
                    'scriptinject:dev'
                ]
            },
            sass: {
                files: ['scss/**/*.scss', 'src/**/*.scss'],
                tasks: ['sass:dev']
            },
            english: {
                files:[
                    "src/scripts/modules/**/en-us.lang.json"
                ],
                tasks: [
                    'language:english'
                ]
            },
            options: {
                spawn: false,
                livereload: true
            }
        },

        karma: {
            all_reports: {
                options: {
                    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                    reporters: ['progress'],

                    preprocessors: (function () {
                        var _preprocessors = {
                            "src/**/*.html": "ng-html2js"
                        };
                        for (var i = 0; i < src_files.length; i++) {
                            _preprocessors[src_files[i]] = "coverage";
                        }
                        return _preprocessors;
                    })()
                },
                //autoWatch: false, //karma default
                singleRun: true
            },
            all_noreports: {
                singleRun: true
            },
            selected: {
                singleRun: true
            },

            options: {
                // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
                browsers: '<%= unitBrowsersArray %>',
                files: '<%= unitTestsArray %>',
                colors: true,
                logLevel: '<%= logLevel %>',
                runnerPort: 9999,
                frameworks: ['jasmine'],
                ngHtml2JsPreprocessor: {
                    stripPrefix: 'src'
                }
            }
        },

        protractor_webdriver: {
            options: {
                // Task-specific options go here.
            },
            dev: {
                options: {
                    //                    path: '/path/to/',
                    command: 'webdriver-manager start --standalone',
                    keepAlive: false
                }
            }
        },

        protractor: {
            options: {
                keepAlive: false,
                noColor: false
            },
            e2e: {
                options: {
                    configFile: 'test/e2e.conf.js',
                    args: {
                        specs: '<%= e2eTestsArray %>',
                        capabilities: { 'browserName': '<%= e2eBrowser %>' }
                        //Note: multiCapabilities is not yet passed on by grunt-protractor-runner
                        //https://github.com/teerapap/grunt-protractor-runner/pull/62
                        //multiCapabilities: '<%= e2eBrowsersArray %>'
                        //Example: [ { 'browserName': 'firefox' },
                        //           { 'browserName': 'chrome'  } ]
                    }
                }
            }
        },

        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dev: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded'
                },
                files: {
                    'src/css/app.css': 'scss/app.scss'
                }
            },
            prod: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'build/app.css': 'scss/app.scss'
                }
            }
        },

        clean: {
            dev: ['src/lib', 'src/css', 'src/mocks', 'build', 'src/scripts/app.templates.js'],
            mocks: ['src/mocks', 'src/scripts/app.templates.js'],
            js: ['src/lib'],
            prod: ['dist', 'output', 'www', 'build']
        },


        scriptinject: {
            dev: {
                //order is important if this script will be concated and minified
                srcs: addPostfix(dev_files, ''),
                html: 'src/index.html', //file that as the block comment to look for a place to insert the script tags
                without: 'src', //this script will be used to remove this block of string of script tag file location
                template: '<script src="%file_path%"></script>' //Used to modify the template that is going to be injected. The string "%file_path%" will be replaced with the path of the file injected.
            },
            web: {
                srcs: addPostfix(['build/app.min.js'], '?bust=v' + buildDateTime),
                html: 'output/web/index.html', //file that as the block comment to look for a place to insert the script tags
                without: 'build/', //this script will be used to remove this block of string of script tag file location
                template: '<script src="%file_path%"></script>' //Used to modify the template that is going to be injected. The string "%file_path%" will be replaced with the path of the file injected.
            }
        },

        copy: {
            index: {
                src: 'src/templates/index.html',
                dest: 'src/',
                expand: true,
                flatten: true
            },
            templates: {
                src: '<%= ngtemplates.app.dest %>',
                dest: 'src/scripts',
                expand: true,
                flatten: true
            },
            lib: {
                src: dep_files,
                dest: 'src/lib',
                expand: true,
                flatten: true
            },
            mocks: {
                src: ['test/mocks/**', 'build/mockData.js'],
                dest: 'src/mocks',
                expand: true,
                flatten: true
            },
            prod: {
                files: [
                    {src: 'src/*.html',             dest: 'output/web',             expand: true, flatten: true},
                    {src: 'build/app.min.js',       dest: 'output/web',             expand: true, flatten: true},
                    {src: 'build/app.css',          dest: 'output/web/css',         expand: true, flatten: true},
                    {src: 'src/languages/*.*',      dest: 'output/web/languages',   expand: true, flatten: true},
                ]
            }
        },

        connect: {
            options:{
                livereload: true,
                middleware: function(connect, options, middlewares) {
                    var middleware = [];

                    // 1. mod-rewrite behavior
                    var rules = [
                        '!\\.html|\\.js|\\.css|\\.woff|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
                    ];
                    middleware.push(rewrite(rules));

                    // 2. original middleware behavior
                    var base = options.base;
                    if (!Array.isArray(base)) {
                        base = [base];
                    }
                    base.forEach(function(path) {
                        middleware.push(connect.static(path));
                    });

                    return middleware;

                }
            },
            server: {
                options: {
                    base: 'src',
                    port: 8000,
                    open: {
                        target: 'http://localhost:8000'
                    }
                    // https://github.com/gruntjs/grunt-contrib-connect
                }
            },
            prod_server: {
                options: {
                    base: 'output/web/',
                    port: 8000,
                    open: {
                        target: 'http://localhost:8000'
                    }
                }
            }
        },

        replace: {
            local: {
                options: {
                    patterns: [
                        { match: 'cssLink',       replacement: sharedValues.cssLinkSlash },
                        { match: 'faviconLink',   replacement: sharedValues.faviconLinkSlash }
                    ]
                },
                files: [{ expand: true, flatten: true, src: ['src/index.html'], dest: 'src/'}]
            },
            devLocal: {
                options: {
                    patterns: [
                        { match: 'appName', replacement: 'app' }
                    ]
                },
                files: [{ expand: true, flatten: true, src: ['src/index.html'], dest: 'src/'}]
            },
            mockLocal: {
                options: {
                    patterns: [
                        { match: 'appName', replacement: 'mockedApp' }
                    ]
                },
                files: [{ expand: true, flatten: true, src: ['src/index.html'], dest: 'src/'}]
            },
            dist: {
                options: {
                    patterns: [
                        { match: 'appName',      replacement: 'app' },
                        { match: 'cssLink',      replacement: sharedValues.cssLink }
                    ]
                },
                files: [{ expand: true, flatten: true, src: ['src/index.html'], dest: 'src/'}]
            },
            webDist: {
                options: {
                    patterns: [
                        { match: 'faviconLink',   replacement: sharedValues.faviconLink }
                    ]
                },
                files: [{ expand: true, flatten: true, src: ['output/web/index.html'], dest: 'output/web/'}]
            }
        }

    });

    function addPostfix(urls, postfix) {
        var _urls = [];
        for (var i = 0; i < urls.length; i++) {
            _urls.push(urls[i] + postfix);
        }
        return _urls;
    }

    function prettyPrintArray(arr) {
        if (!(arr instanceof Array)) {
            grunt.log.writeln("prettyPrintArray: Not an array.");
            return;
        }
        var outPrefix, outSuffix;
        for (var i = 0; i < arr.length; i++) {
            outPrefix = i === 0 ? "[ " : "  ";
            outSuffix = i == arr.length - 1 ? " ]" : ",";
            grunt.log.writeln(outPrefix + arr[i] + outSuffix);
        }
    }

    //Search for directories matching 'tests', a comma separated list.
    function findTestDirs(tests, basePath, testSuffix) {
        var selectedTestsArray = tests.split(",");
        for(var i=0; i<selectedTestsArray.length; i++) {
            selectedTestsArray[i] = basePath + selectedTestsArray[i];
        }
        var matchedTestsArray = grunt.file.expand( {filter: 'isDirectory'}, selectedTestsArray);
        if(matchedTestsArray.length === 0) {
            grunt.log.writeln("No matching directory(ies) "+ tests);
            process.exit(1);
        }
        var resultsArray = [];
        for(i=0; i<matchedTestsArray.length; i++) {
            resultsArray.push(matchedTestsArray[i] + "/**/*."+ testSuffix + ".js");
        }
        return resultsArray;
    }



};
