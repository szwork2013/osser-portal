var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var User = models.User;
var Message = models.Message;

var guser1, guser2;
var gmsg1;

describe('Message', function () {
    before(function (done) {
        Message.remove(function (err) {
            User.remove({
                appeal: 'formessage'
            }, function (err) {
                var user1 = new User({
                    username: 'testuser1',
                    appeal: 'formessage'
                });
                user1.save(function (err, user1) {
                    //console.log(user1);
                    guser1 = user1;
                    var user2 = new User({
                        username: 'testuser2',
                        appeal: 'formessage'
                    });
                    user2.save(function (err, user2) {
                        //console.log(user2);
                        guser2 = user2;
                        done();
                    });
                });
            });
        });
    });

    it('Message1を追加して、失敗しました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.create, {}, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('fail');
            body.errors.tid.param.should.equal('tid');
            body.errors.tid.msg.should.equal('受信者はありません。');
            body.errors.content.param.should.equal('content');
            body.errors.content.msg.should.equal('入力内容はありません。');
            done();
        });
    });

    it('guser1からguser2にメッセージ1を送信しました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.create, {
            fid: guser1._id,
            tid: guser2._id,
            content: 'helo user2.'
        }, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.message.fid.should.equal(guser1._id.toString());
            body.message.tid.should.equal(guser2._id.toString());
            body.message.content.should.equal('helo user2.');
            body.message.status.should.equal('公開');
            gmsg1 = body.message;
            done();
        });
    });

    it('guser2はメッセージに返事しました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.create, {
            fid: guser2._id,
            tid: guser1._id,
            content: 'こんんちは、user1さんへ',
            pid: gmsg1._id
        }, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.message.parent.should.equal(gmsg1._id.toString());
            body.message.fid.should.equal(guser2._id.toString());
            body.message.tid.should.equal(guser1._id.toString());
            body.message.content.should.equal('こんんちは、user1さんへ');
            body.message.status.should.equal('公開');
            done();
        });
    });

    it('guser1はさらに返事をしました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.create, {
            fid: guser1._id,
            tid: guser2._id,
            content: 'node.jsに興味ありますか？',
            pid: gmsg1._id
        }, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.message.parent.should.equal(gmsg1._id.toString());
            body.message.fid.should.equal(guser1._id.toString());
            body.message.tid.should.equal(guser2._id.toString());
            body.message.content.should.equal('node.jsに興味ありますか？');
            body.message.status.should.equal('公開');
            done();
        });
    });

    it('msg1を検索しました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.find, {
            id: gmsg1._id
        }, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.message.fid.should.equal(guser1._id.toString());
            body.message.tid.should.equal(guser2._id.toString());
            body.message.content.should.equal('helo user2.');
            body.message.status.should.equal('公開');
            body.messages.length.should.equal(2);
            body.messages[0].fid.should.equal(guser2._id.toString());
            body.messages[0].tid.should.equal(guser1._id.toString());
            body.messages[0].content.should.equal('こんんちは、user1さんへ');
            body.messages[1].fid.should.equal(guser1._id.toString());
            body.messages[1].tid.should.equal(guser2._id.toString());
            body.messages[1].content.should.equal('node.jsに興味ありますか？');
            done();
        });
    });

    it('guser1からguser2にメッセージ２を送りました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.create, {
            fid: guser1._id,
            tid: guser2._id,
            content: '友達になりませんか？'
        }, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.message.fid.should.equal(guser1._id.toString());
            body.message.tid.should.equal(guser2._id.toString());
            body.message.content.should.equal('友達になりませんか？');
            body.message.status.should.equal('公開');
            gmsg1 = body.message;
            done();
        });
    });

    it('guser1から送ったメッセージを検索しました', function (done) {
        common.gapi.post(common.gconfig.site.api.message.search, {
            fid: guser1._id,
            isparentonly: true
        }, function (err, response, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.messages.length.should.equal(2);
            done();
        });
    });
});