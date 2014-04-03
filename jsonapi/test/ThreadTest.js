var should = require('should');
//var request = require('request');
var common = require('../../common');
var models = require('../api/models');
var Thread = models.Thread;

describe('Thread', function () {
    before(function (done) {
        Thread.remove({}, function (err) {
            done();
        });
    });
    it('Thread1を作成した後、更新もしました。', function (done) {
        common.gapi.post(common.gconfig.site.api.thread.create, {}, function (err, res, body) {
            body.result.should.equal('fail');
            body.errors.title.msg.should.equal(common.gmsg.mustinput_title);
            body.errors.uid.msg.should.equal(common.gmsg.mustinput_uid);
            body.errors.content.msg.should.equal(common.gmsg.mustinput_content);
            common.gapi.post('/user/create', {
                username: 'karithread',
                email: 'karithread@osser.jp',
                password1: 'karithread',
                password2: 'karithread',
                sex: '不明',
                prefecture: '北海道',
                status: 'アクティブ',
                isadmin: true,
                isemailauth: true,
                myurl: 'karithread'
            }, function (err, res, body) {
                var data_uid = body.id;
                common.gapi.post(common.gconfig.site.api.thread.create, {
                    uid: data_uid,
                    title: 'Node.jsコミュニティ・日本を開設しました',
                    summary: 'Node.js-サマリー-3892',
                    content: 'Node.js-コンテンツ-4892'
                }, function (err, res, body) {
                    body.result.should.equal('ok');
                    common.gapi.get(common.gconfig.site.api.thread.find + '/' + body.id, function (err, res, body) {
                        body.result.should.equal('ok');
                        body.thread.uid.should.equal(data_uid);
                        should.exist(body.thread.nid);
                        body.thread.title.should.equal('Node.jsコミュニティ・日本を開設しました');
                        body.thread.status.should.equal('公開');
                        body.thread.summary.should.equal('Node.js-サマリー-3892');
                        body.thread.content.should.equal('Node.js-コンテンツ-4892');
                        common.gapi.post(common.gconfig.site.api.thread.update + '/' + body.thread._id, {
                            uid: data_uid,
                            title: 'title-3892378',
                            summary: 'summary-392984781',
                            content: 'content-389232893289478',
                            status: '下書き'
                        }, function (err, res, body) {
                            body.result.should.equal('ok');
                            body.thread.uid.should.equal(data_uid);
                            should.exist(body.thread.nid);
                            body.thread.title.should.equal('title-3892378');
                            body.thread.summary.should.equal('summary-392984781');
                            body.thread.content.should.equal('content-389232893289478');
                            body.thread.status.should.equal('下書き');
                            common.gapi.get(common.gconfig.site.api.thread.findBynid + '/' + body.thread.nid, function (err, res, body) {
                                body.result.should.equal('ok');
                                body.thread.uid._id.should.equal(data_uid);
                                should.exist(body.thread.nid);
                                body.thread.title.should.equal('title-3892378');
                                body.thread.summary.should.equal('summary-392984781');
                                body.thread.content.should.equal('content-389232893289478');
                                body.thread.status.should.equal('下書き');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
    it('Thread2を作成しました', function (done) {
        common.gapi.post(common.gconfig.site.api.thread.create, {
            uid: "52e3a142ced9900c440a0f50",
            title: 'title-83927812',
            summary: 'summary-38920129',
            content: 'content-48931044',
            status: '下書き'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            common.gapi.get(common.gconfig.site.api.thread.find + '/' + body.id, function (err, res, body) {
                body.result.should.equal('ok');
                body.thread.uid.should.equal('52e3a142ced9900c440a0f50');
                body.thread.title.should.equal('title-83927812');
                body.thread.summary.should.equal('summary-38920129');
                body.thread.content.should.equal('content-48931044');
                body.thread.status.should.equal('下書き');
                done();
            });
        });
    });

    it('search', function (done) {
        Thread.remove({}, function (err) {
            common.gapi.post(common.gconfig.site.api.thread.create, {
                uid: "52e3a142ced9900c440a0f50",
                title: 'title-83927812',
                summary: 'summary-38920129',
                content: 'content-48931044',
                status: '下書き'
            }, function (err, res, body) {
                body.result.should.equal('ok');
                //console.log(body);
                common.gapi.post(common.gconfig.site.api.thread.search, {
                    status: '削除',
                    limit: 10,
                    skip: 20
                }, function (err, res, newbody) {
                    //console.log(newbody.threads.length);
                    common.gapi.post(common.gconfig.site.api.thread.destory + '/' + body.id, {
                        uid: "52e3a142ced9900c440a0f50"
                    }, function (err, res, body) {
                        //console.log(body);
                        body.result.should.equal('ok');
                        body.thread.uid.should.equal('52e3a142ced9900c440a0f50');
                        body.thread.title.should.equal('title-83927812');
                        body.thread.summary.should.equal('summary-38920129');
                        body.thread.content.should.equal('content-48931044');
                        body.thread.status.should.equal('削除');
                        common.gapi.post(common.gconfig.site.api.thread.count, {
                            status: '下書き'
                        }, function (err, res, body) {
                            body.result.should.equal('ok');
                            body.count.should.equal(0);
                            common.gapi.post(common.gconfig.site.api.thread.count, {
                                status: '削除'
                            }, function (err, res, body) {
                                body.result.should.equal('ok');
                                body.count.should.equal(1);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('searchFromComment', function (done) {
        common.gapi.post(common.gconfig.site.api.thread.create, {
            uid: "52e3a142ced9900c440a0f51",
            title: 'Node.jsコミュニティ・日本を開設しました',
            summary: 'Node.js-サマリー-3892a',
            content: 'Node.js-コンテンツ-4892a'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            common.gapi.get(common.gconfig.site.api.thread.find + '/' + body.id, function (err, response, body) {
                common.gapi.post(common.gconfig.site.api.comment.create, {
                    uid: body.thread.uid,
                    nid: body.thread.nid,
                    content: '1:いいサイトだよね。'
                }, function (err, res, newbody) {
                    common.gapi.post(common.gconfig.site.api.comment.create, {
                        uid: body.thread.uid,
                        nid: body.thread.nid,
                        content: '2:いいサイトだよね。'
                    }, function (err, res, newbody) {
                        common.gapi.post(common.gconfig.site.api.thread.searchFromComment, {
                            uid: "52e3a142ced9900c440a0f51",
                            status: '公開',
                            limit: 10,
                            skip: 0
                        }, function (err, res, body) {
                            //console.log(body);
                            body.result.should.equal('ok');
                            body.threads.length.should.equal(1);
                            body.threads[0].commentcount.should.equal(2);
                            body.threads[0].thread.title.should.equal('Node.jsコミュニティ・日本を開設しました');
                            body.threads[0].thread.summary.should.equal('Node.js-サマリー-3892a');
                            body.threads[0].thread.content.should.equal('Node.js-コンテンツ-4892a');
                            done();
                        });
                    });
                });
            });
        });
    });
});