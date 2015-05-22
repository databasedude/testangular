# Testing Angular Demo

Clone this project to your workspace.

Environment prerequisites:

[Node.js](http://node.org)

[Grunt](http://gruntjs.com/)

[Grunt CLI](http://gruntjs.com/getting-started)

[Bower](http://bower.io/)


APP setup:

Navigate to the testangular directory, then run the following command:

    $ npm install

This install all of the dependencies, both node and bower.

Grunt Dev
---------------------
This command starts a node.js server and runs the tests.  A chrome browser should open automatically at
http://localhost:8000.  A grunt watch task will detect any changes to javascript, html or css files and
reload the browser.

To run the app in localhost with mock data:

    $ grunt dev --mock

To run end-to-end tests, run the following command:

    $ grunt e2e --mock

It is possible to run the end-to-end tests without running the unit tests to save time.

    $ grunt e2e --karma=false --mock

To run individual tests, pass a comma separated list to the "tests" parameter:

    $ grunt e2e --tests=graphs,profile --mock

The "tests" and "karma" parameters may both be used if desired:

    $ grunt e2e --karma=false --tests=login,profile --mock

Help
----------
To get a list of commands:

    $ grunt --help







