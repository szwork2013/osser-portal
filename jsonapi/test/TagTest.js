var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var Tag = models.Tag;

describe('Tag', function () {
    before(function (done) {
        Tag.remove({}, function (err) {
            done();
        });
    });
    it('Linuxタグを作成しました', function (done) {
        common.gapi.post(common.gconfig.site.api.tag.create, {
            name: 'linux',
            url: 'linux-url'
        }, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.tag.name.should.equal('linux');
            body.tag.url.should.equal('linux-url');
            body.tag.status.should.equal('公開');
            body.tag.weight.should.equal(500);
            common.gapi.get(common.gconfig.site.api.tag.find + '/' + body.tag._id, function (err, res, body) {
                body.result.should.equal('ok');
                body.tag.name.should.equal('linux');
                body.tag.url.should.equal('linux-url');
                body.tag.status.should.equal('公開');
                body.tag.weight.should.equal(500);
                done();
            });
        });
    });
    it('Nodejsタグを作成しました', function (done) {
        common.gapi.post(common.gconfig.site.api.tag.create, {
            name: 'nodejs',
            weight: 999
        }, function (err, res, body) {
            body.result.should.equal('ok');
            body.tag.name.should.equal('nodejs');
            should.not.exist(body.tag.url);
            body.tag.status.should.equal('公開');
            body.tag.weight.should.equal(999);
            done();
        });
    });
    it('Javascriptタグを作成しました', function (done) {
        common.gapi.post(common.gconfig.site.api.tag.create, {
            name: 'javascript',
            url: 'javascript-url',
            weight: 998
        }, function (err, res, body) {
            body.result.should.equal('ok');
            body.tag.name.should.equal('javascript');
            body.tag.url.should.equal('javascript-url');
            body.tag.status.should.equal('公開');
            body.tag.weight.should.equal(998);
            done();
        });
    });
    it('タグを検索しました、３件を見つけました', function (done) {
        common.gapi.post(common.gconfig.site.api.tag.search, {
            sortOptions: {
                weight: -1
            }
        }, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.tags.length.should.equal(3);
            done();
        });
    });
});