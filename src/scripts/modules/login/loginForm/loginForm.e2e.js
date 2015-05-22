
describe('Login Form', function(){

    var language  = require('en-us'),
        loginForm = require('./loginForm.po.js');

    beforeAll(function(){
        loginForm.getPage();
    });

    afterEach(function(){
        loginForm.reset();
    });

    describe('when the form initially loads', function(){
        it('the form should have the title "Sign In"', function(){
            expect(loginForm.getTitle()).toEqual(language.LOGIN_FORM_TITLE);
        });

        it('the email input placeholder should be displayed and localized', function(){
            expect(loginForm.username.placeholder()).toEqual(language.EMAIL_PLACEHOLDER);
        });

        it('the sign-in button text should be localized', function(){
            expect(loginForm.submitButton.text()).toEqual(language.SIGNIN_BUTTON);
        });

        it('no input errors should be displayed', function(){
            expect(loginForm.isShowingErrorMessage()).toBe(false);
        });

    });

    describe('when a user submits an empty login form', function(){

        beforeEach(function(){
            loginForm.submit();
        });

        it('the username field should have an error', function(){
            expect(loginForm.username.hasError()).toBe(true);
        });

        it('the username-is-required error should be displayed and localized', function(){
            expect(loginForm.username.isRequiredText()).toEqual(language.ENTER_VALID_EMAIL);
        });

        it('the password field should have an error', function(){
            expect(loginForm.password.hasError()).toBe(true);
        });

        it('password-is-required message should be displayed and localized', function(){
            expect(loginForm.password.isRequiredText()).toEqual(language.MISSING_PASSWORD);
        });

    });

    describe('when a user enters a username but not a password and clicks submit', function(){
        beforeEach(function(){
            loginForm.username.typeText('demo3@sunpower.com');
            loginForm.submit();
        });

        it('the username error message should be hidden', function(){
            expect(loginForm.username.hasError()).toBe(false);
        });

        it('the password-required error message should be displayed', function(){
            expect(loginForm.password.isRequiredText()).toEqual(language.MISSING_PASSWORD);
        });

    });

    describe('when a user enters an ill-formed email/username and a valid length password', function(){
        beforeEach(function(){
            loginForm.username.typeText('bademailaddress');
            loginForm.password.typeText('password');
            loginForm.submit();
        });

        it('the username field should display the invalid-email-format error', function(){
            expect(loginForm.username.invalidEmailErrorText()).toEqual(language.EMAIL_INVALID_FORMAT_ERROR);
        });

        it('the password field should display no error message', function(){
            expect(loginForm.password.hasError()).toBe(false);
        });
    });

    describe('when a user enters a valid email address and a password that is too short', function(){
        beforeEach(function(){
            loginForm.username.typeText('demo3@sunpower.com');
            loginForm.password.typeText('su');
            loginForm.submit();
        });

        it('the username field should display no errors', function(){
            expect(loginForm.username.hasError()).toBe(false);
        });

        it('the minimum-length error should be displayed', function(){
            expect(loginForm.password.minimumLengthError()).toEqual(language.MIN_LENGTH_ERROR_PASSWORD);
        });

    });

    describe('when the form is submitted with invalid credentials', function(){
        beforeEach(function(){
            loginForm.username.typeText('badCreds@domain.com');
            loginForm.password.typeText('password');
            loginForm.submit();
        });

        it('the invalid-creds error should appear', function(){
            expect(loginForm.errorMessage()).toEqual(language.INVALID_EMAIL_PASSWORD);
        });

    });

    describe('when a user enters valid credentials', function() {

        beforeEach(function(){
            loginForm.username.typeText('darryl@domain.com');
            loginForm.password.typeText('password');
            loginForm.submit();
        });

        it('it should redirect user to the dashboard page', function(){
            browser.getCurrentUrl().then(
                function onSuccess(url){
                    expect(url.indexOf('/dashboard') > -1).toEqual(true);
                    loginForm.getPage(); // now return to login form
                }
            );
        });

    });


});
