var should = require('should');
var validator = require('validator');
var common = require('../');

describe('gmd', function(){
    it('~~deleted~~', function(){
        validator.trim(common.gmd.tohtml('~~deleted~~')).should.equal('<p><del>deleted</del></p>');;
    });
    
});