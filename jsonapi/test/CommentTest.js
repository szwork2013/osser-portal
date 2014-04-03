var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var Comment = models.Comment;

describe('Comment', function () {
    before(function (done) {
        Comment.remove(function (err) {
            done();
        });
    });
    it('コメント1を追加したいですが、nidは指定していないため、追加失敗しました。', function (done) {
        common.gapi.post(common.gconfig.site.api.comment.create, {}, function (err, res, body) {
            body.errors.uid.msg.should.equal(common.gmsg.mustinput_uid);
            body.errors.nid.msg.should.equal(common.gmsg.mustinput_nid);
            body.errors.content.msg.should.equal(common.gmsg.mustinput_content);
            done();
        });
    });
    it('Thread1を追加した、後はThread1へのコメント1を追加しました。', function (done) {
        common.gapi.post(common.gconfig.site.api.thread.create, {
            uid: "52e3a142ced9900c440a0f49",
            title: 'Node.jsコミュニティ・日本を開設しました',
            summary: 'Node.js-サマリー-3892',
            content: 'Node.js-コンテンツ-4892'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            common.gapi.get(common.gconfig.site.api.thread.find + '/' + body.id, function (err, response, body) {
                common.gapi.post(common.gconfig.site.api.comment.create, {
                    uid: body.thread.uid,
                    nid: body.thread.nid,
                    content: 'いいサイトだよね。'
                }, function (err, res, newbody) {
                    common.gapi.get(common.gconfig.site.api.comment.find + '/' + newbody.id, function (err, response, commentbody) {
                        //console.log(commentbody);
                        commentbody.result.should.equal('ok');
                        commentbody.comment.nid.should.equal(body.thread.nid.toString());
                        commentbody.comment.uid.should.equal(body.thread.uid.toString());
                        commentbody.comment.content.should.equal('いいサイトだよね。');
                        commentbody.comment.status.should.equal('公開');
                        common.gapi.post(common.gconfig.site.api.comment.create, {
                            uid: body.thread.uid,
                            nid: body.thread.nid,
                            pid: commentbody.comment._id,
                            content: '確かにそうですね、一緒に勉強しましょう。'
                        }, function (err, res, replaybody) {
                            common.gapi.get(common.gconfig.site.api.comment.find + '/' + replaybody.id, function (err, response, findreplaybody) {
                                findreplaybody.result.should.equal('ok');
                                findreplaybody.comment.nid.should.equal(body.thread.nid.toString());
                                findreplaybody.comment.uid.should.equal(body.thread.uid.toString());
                                findreplaybody.comment.content.should.equal('確かにそうですね、一緒に勉強しましょう。');
                                findreplaybody.comment.parent.should.equal(commentbody.comment._id);
                                findreplaybody.comment.status.should.equal('公開');

                                common.gapi.post(common.gconfig.site.api.comment.destory, {
                                    id: findreplaybody.comment._id,
                                    uid: body.thread.uid
                                }, function (err, response, body) {
                                    body.result.should.equal('ok');
                                    body.comment.status.should.equal('削除');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    it('search', function (done) {
        common.gapi.post('/user/findByEmail', {
            email: 'admin@osser.jp'
        }, function (err, res, body) {
            var data_uid = body.user._id;
            common.gapi.post(common.gconfig.site.api.thread.create, {
                uid: data_uid,
                title: 'Node.jsコミュニティ・日本を開設しました',
                summary: 'Node.js-サマリー-3892',
                content: 'Node.js-コンテンツ-4892'
            }, function (err, res, body) {
                body.result.should.equal('ok');
                common.gapi.get(common.gconfig.site.api.thread.find + '/' + body.id, function (err, res, body) {
                    common.gapi.post(common.gconfig.site.api.comment.create, {
                        uid: body.thread.uid,
                        nid: body.thread.nid,
                        content: 'いいサイトだよね。'
                    }, function (err, res, newbody) {
                        common.gapi.get(common.gconfig.site.api.comment.find + '/' + newbody.id, function (err, response, commentbody) {
                            common.gapi.post(common.gconfig.site.api.comment.create, {
                                uid: body.thread.uid,
                                nid: body.thread.nid,
                                pid: commentbody.comment._id,
                                content: '確かにそうですね、一緒に勉強しましょう。'
                            }, function (err, res, replaybody) {
                                common.gapi.post(common.gconfig.site.api.comment.search, {
                                    nid: body.thread.nid,
                                    istreeshow: true
                                }, function (err, response, body2) {
                                    body2.comments[0].subcomments[0].uid.username.should.equal('admin');
                                    body2.comments[0].subcomments[0].uid.email.should.equal('admin@osser.jp');
                                    common.gapi.post(common.gconfig.site.api.comment.destory, {
                                        id: body2.comments[0].subcomments[0]._id,
                                        uid: body2.comments[0].subcomments[0].uid._id
                                    }, function (err, response, body1) {
                                        body1.result.should.equal('ok');
                                        body1.comment.status.should.equal('削除');

                                        common.gapi.post(common.gconfig.site.api.comment.search, {
                                            nid: body.thread.nid,
                                            istreeshow: true
                                        }, function (err, response, body0) {
                                            body0.comments[0].subcomments.length.should.equal(0);
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
});