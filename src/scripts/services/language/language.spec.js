/**
 * Created by dlparker on 9/12/14.
 */

describe('language service', function(){

    beforeEach(module('app.services'));

    it('should map en to en-us', inject(function(language){
        expect(language.getLanguageCode()).toEqual('en-us');
    }));

});
