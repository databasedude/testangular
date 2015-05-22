
var loginForm = function(){
    "use strict";

    var title               = element(by.css('[translate="LOGIN_FORM_TITLE"]')),
        submit_button       = element(by.css('#login_form input[type="submit"]')),
        usernameInput       = element(by.css('[name="email"]')),
        passwordInput       = element(by.css('[name="pass"]')),
        username_error      = element(by.id('username_error')),
        password_error      = element(by.id('password_error')),
        email_req_msg       = element(by.css('[translate="ENTER_VALID_EMAIL"]')),
        email_invalid       = element(by.css('[translate="EMAIL_INVALID_FORMAT_ERROR"]')),
        password_req_msg    = element(by.css('[translate="MISSING_PASSWORD"]')),
        password_min_len_msg= element(by.css('[translate="MIN_LENGTH_ERROR_PASSWORD"]')),
        error               = element(by.id('error'));

    this.submit = function(){
        submit_button.click();
    };

    this.getPage = function(){
        browser.get('http://localhost:8000/#/login');
    };

    this.getTitle = function(){
        return title.getText();
    };

    this.username = {
        placeholder: function(){
            return usernameInput.getAttribute('placeholder');
        },
        typeText: function(text){
            usernameInput.sendKeys(text);
        },
        hasError: function(){
            return username_error.isDisplayed();
        },
        isRequiredText: function(){
            if (username_error.isDisplayed() && email_req_msg.isDisplayed()){
                return email_req_msg.getText();
            }
        },
        invalidEmailErrorText: function(){
            if (username_error.isDisplayed() && email_invalid.isDisplayed()){
                return email_invalid.getText();
            }
        }

    };

    this.password = {
        placeholder: function(){
            return passwordInput.getAttribute('placeholder');
        },
        typeText: function(text){
            passwordInput.sendKeys(text);
        },
        hasError: function(){
            return password_error.isDisplayed();
        },
        isRequiredText: function(){
            if (password_error.isDisplayed() && password_req_msg.isDisplayed()){
                return password_req_msg.getText();
            }
        },
        minimumLengthError: function(){
            if (password_error.isDisplayed() && password_min_len_msg.isDisplayed()){
                return password_min_len_msg.getText();
            }
        }
    };

    this.isShowingErrorMessage = function(){
        return password_error.isDisplayed() || username_error.isDisplayed();
    };

    this.submitButton = {
        text: function(){
            return submit_button.getAttribute('value');
        }
    };

    this.errorMessage = function(){
        if (error.isDisplayed()) return error.getText();
    };

    this.reset = function(){
        usernameInput.clear();
        passwordInput.clear();
    };


};

module.exports = new loginForm();
