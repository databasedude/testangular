/**
* Created by dlparker on 1/15/15.
*/


describe('spLoginForm directive', function(){
    beforeEach(module('app'));
    beforeEach(module('mockData'));

    var $compile, $httpBackend, $rootScope, element, scope, unitMocks, language;

    beforeEach(inject(function(_$compile_) { $compile = _$compile_; }));
    beforeEach(inject(function(_$httpBackend_) { $httpBackend = _$httpBackend_; }));
    beforeEach(inject(function(_$rootScope_) { $rootScope = _$rootScope_; }));
    beforeEach(inject(function(_unitMocks_) { unitMocks = _unitMocks_; }));
    beforeEach(function(){ language = unitMocks.getLanguageFile.getResponse(); });

    beforeEach(function(){
        unitMocks.expect.getLanguageFile();
    });

    beforeEach(function(){
        scope = $rootScope.$new();
        element = angular.element('<div sp-login-form></div>');
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
    });

    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('when the login form directive first loads', function() {

        it('should render the Email placeholder text localized', function() {
            expect(element.find('[name="email"]').attr('placeholder')).toEqual(language.EMAIL_PLACEHOLDER);
        });

        it('should render the Password  placeholder text localized', function() {
            expect(element.find('[name="pass"]').attr('placeholder')).toEqual(language.PASSWORD);
        });

        it('should render the Keep Me Signed In link text localized', function() {
            expect(element.find('[translate="KEEP_ME_SIGNED_IN"]').text()).toEqual(language.KEEP_ME_SIGNED_IN);
        });

        it('should have a localized sign in button', function(){
            expect(element.find('input[type="submit"]').val()).toEqual(language.SIGNIN_BUTTON);
        });

    });

    describe('when the form is submitted without an email or password', function() {
        beforeEach(function(){
            element.find('input[type="submit"]').click();
        });

        it('should show an email error message', function(){
            expect(element.find('#username_error').hasClass('ng-hide')).toBe(false);
            expect(element.find('[translate="ENTER_VALID_EMAIL"]').text()).toEqual(language.ENTER_VALID_EMAIL);
        });

        it('should show a password error message', function(){
            expect(element.find('#password_error').hasClass('ng-hide')).toBe(false);
            expect(element.find('[translate="MISSING_PASSWORD"]').text()).toEqual(language.MISSING_PASSWORD);
        });


    });

    describe('when the email is malformed when submitted', function() {
        beforeEach(function(){
            element.find('[name="email"]').val('a@b').trigger('input');
            element.find('[name="pass"]').val('xxx').trigger('input');
            element.find('input[type="submit"]').click();
        });

        it('should show an email error message', function(){
            expect(element.find('#username_error').hasClass('ng-hide')).toBe(false);
            expect(element.find('[translate="EMAIL_INVALID_FORMAT_ERROR"]').text()).toEqual(language.EMAIL_INVALID_FORMAT_ERROR);
        });
    });

    describe('when password is not long enough', function() {
        beforeEach(function(){
            element.find('[name="email"]').val('a@b.net').trigger('input');
            element.find('[name="pass"]').val('xx').trigger('input');
            element.find('input[type="submit"]').click();
        });

        it('should show a password error message', function(){
            expect(element.find('#password_error').hasClass('ng-hide')).toBe(false);
            expect(element.find('[translate="MISSING_PASSWORD"]').text()).toEqual(language.MISSING_PASSWORD);
        });
    });

    describe('when the form is submitted with invalid credentials', function() {
        beforeEach(function(){
            unitMocks.expect.mockAuthRequest('badCreds');
            element.find('[name="email"]').val('badCreds@domain.com').trigger('input');
            element.find('[name="pass"]').val('password').trigger('input');
            element.find('input[type="submit"]').click();
            $httpBackend.flush();
        });

        it('it should show an authentication error', function(){
            expect(element.find('#error').text()).toEqual(language.INVALID_EMAIL_PASSWORD);
        });

        it('the "submit" button should switch back to normal text', function(){
            expect(element.find('input[type="submit"]').length).toEqual(1);
            expect(element.find('input[type="submit"]').val()).toEqual(language.SIGNIN_BUTTON);
        });


    });

    describe('when the form has valid credentials and "keep me logged in" is not checked', function(){
        var $state, $http;

        beforeEach(inject(function(_$state_, _$http_){
            $state = _$state_;
            $http = _$http_;
            spyOn(scope.login, 'login').and.callThrough();
            spyOn($http, 'post').and.callThrough();
            spyOn($state, 'go').and.callThrough();
        }));

        beforeEach(function(){
            unitMocks.expect.mockAuthRequest('default');
            element.find('[name="email"]').val('darryl@domain.com').trigger('input');
            element.find('[name="pass"]').val('password').trigger('input');
            element.find('input[type="submit"]').click();
            $httpBackend.flush();
        });

        it('the controller createAccount method should be called', function(){
            expect(scope.login.login).toHaveBeenCalled();
        });

        it('a callback should be made to authenticate', function(){
            expect($http.post).toHaveBeenCalled();
        });

        it('it should redirect to the dashboard page', function(){
            expect($state.go).toHaveBeenCalledWith('dashboard');
        });

        it('should return no errors', function(){
            expect(scope.login.error).toBe(undefined);
        });

    });

});
