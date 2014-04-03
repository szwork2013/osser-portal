var should = require('should');
//var request = require('request');
var common = require('../../../common');
var models = require('../../api/models');
var User = models.User;

describe('User', function () {
    before(function (done) {
        User.remove({}, function (err) {
            done();
        });
    });

    it('adminを追加しました', function (done) {
        common.gapi.post(common.gconfig.site.api.user.create, {
            username: 'admin',
            email: 'admin@osser.jp',
            password1: 'aaaaaa',
            password2: 'aaaaaa',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: true,
            myurl: 'admin',
            mylogo: '',
            mylogotype: 'Gravatar',
            appeal: 'I like osser.jp.'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            done();
        });
    });
    it('komaを追加しました', function (done) {
        common.gapi.post(common.gconfig.site.api.user.create, {
            username: 'koma',
            email: 'koma@osser.jp',
            password1: 'aaaaaa',
            password2: 'aaaaaa',
            sex: '女',
            prefecture: '大阪府',
            status: 'アクティブ',
            isadmin: false,
            isemailauth: true,
            myurl: 'koma',
            mylogo: common.gconfig.url.image.osser_logo,
            mylogotype: '外部リンク',
            appeal: 'I like nodejs.'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            done();
        });
    });
});