var should = require('should');
var async = require('async');
//var request = require('request');
var common = require('../../../common');
var models = require('../../api/models');
var Thread = models.Thread;
var Message = models.Message;

describe('Thread', function () {
    before(function (done) {
        Thread.remove({}, function (err) {
            Message.remove({}, function (err) {
                done();
            });
        });
    });

    it('テスト投稿作成', function (done) {
        common.gapi.post('/user/findByEmail', {
            email: 'admin@osser.jp'
        }, function (err, res, body) {
            var data_uid = body.user._id;
            var threads = new Array(100);
            for (var i = 0; i < threads.length; i++) {
                var content1 = 'Thread-Content-' + i;
                var content2 = 'Thread-Content-' + i + "¥r¥n" + 'bobopapa';
                threads[i] = {
                    index: i,
                    content: (i % 10 == 0) ? content2 : content1
                };
            }
            var j = 1;
            async.each(threads, function (item, cb) {
                common.gapi.post(common.gconfig.site.api.thread.create, {
                    uid: data_uid,
                    title: 'Thread-Title-' + item.index,
                    summary: 'Thread-Summary-' + item.index,
                    content: item.content,
                }, function (err, response, body) {
                    j++;
                    cb();
                });
            }, function (err) {
                if (err) console.error(err);
                //console.log('finished');
                done();
            });
        });
    });

    it('テストメッセージ作成', function (done) {
        common.gapi.post('/user/findByEmail', {
            email: 'admin@osser.jp'
        }, function (err, res, admin) {
            //console.log(admin);
            common.gapi.post('/user/findByEmail', {
                email: 'koma@osser.jp'
            }, function (err, res, koma) {
                //console.log(koma);
                // koma->admin
                var messages = new Array(10);
                for (var i = 0; i < messages.length; i++) {
                    messages[i] = {
                        index: i,
                        content: 'Message to admin from koma ' + i.toString()
                    };
                }
                async.each(messages, function (item, cb) {
                    common.gapi.post(common.gconfig.site.api.message.create, {
                        fid: koma.user._id,
                        tid: admin.user._id,
                        content: item.content
                    }, function (err, response, body) {
                        //console.log(body);
                        cb();
                    });
                }, function (err) {

                    // admin->koma
                    for (var i = 0; i < messages.length; i++) {
                        messages[i] = {
                            index: i,
                            content: 'Message to koma from admin ' + i.toString()
                        };
                    }
                    async.each(messages, function (item, cb) {
                        common.gapi.post(common.gconfig.site.api.message.create, {
                            fid: admin.user._id,
                            tid: koma.user._id,
                            content: item.content
                        }, function (err, response, body) {
                            //console.log(body);
                            cb();
                        });
                    }, function (err) {

                        common.gapi.post(common.gconfig.site.api.message.search, {
                            ftid: admin.user._id,
                            isparentonly: true
                        }, function (err, response, body) {
                            //console.log(JSON.stringify(body));
                            body.result.should.equal('ok');
                            body.messages.length.should.equal(20);
                            common.gapi.post(common.gconfig.site.api.message.search, {
                                ftid: koma.user._id,
                                isparentonly: true
                            }, function (err, response, body) {
                                //console.log(body);
                                body.result.should.equal('ok');
                                body.messages.length.should.equal(20);
                                common.gapi.post(common.gconfig.site.api.message.search, {
                                    fid: koma.user._id,
                                    isparentonly: true
                                }, function (err, response, body) {
                                    //console.log(body);
                                    body.result.should.equal('ok');
                                    body.messages.length.should.equal(10);
                                    common.gapi.post(common.gconfig.site.api.message.search, {
                                        tid: koma.user._id,
                                        isparentonly: true
                                    }, function (err, response, body) {
                                        //console.log(body);
                                        body.result.should.equal('ok');
                                        body.messages.length.should.equal(10);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});