var should = require('should');
//var request = require('request');
var gapi = require('../../common').gapi;
var gfunc = require('../../common').gfunc;
var gmsg = require('../../common').gmsg;
var models = require('../api/models');
var User = models.User;

describe('User', function () {
    before(function (done) {
        User.remove({}, function (err) {
            done();
        });
    });

    it('adminユーザを作成しました', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-982234@osser.jp',
            password1: 'aaaaaa',
            password2: 'aaaaaa',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: true,
            myurl: 'admin-url-829223',
            mylogo: 'mylogo-url',
            mylogotype: 'Gravatar',
            appeal: 'I like osser.jp.'
        }, function (err, res, body) {
            var id = body.id;
            gapi.get('/user/find/' + id, function (err, res, body) {
                should.not.exists(err);
                id.should.equal(body.user._id);
                body.user.username.should.equal('admin');
                body.user.email.should.equal('admin-982234@osser.jp');
                body.user.password.should.equal(gfunc.md5('aaaaaa'));
                body.user.sex.should.equal('男');
                body.user.prefecture.should.equal('東京都');
                body.user.status.should.equal('アクティブ');
                body.user.isadmin.should.equal(true);
                body.user.isemailauth.should.equal(true);
                body.user.myurl.should.equal('admin-url-829223');
                body.user.mylogo.should.equal('mylogo-url');
                body.user.mylogotype.should.equal('Gravatar');
                body.user.appeal.should.equal('I like osser.jp.');
                done();
            });
        });
    });

    it('仮ユーザを作成しました', function (done) {
        gapi.post('/user/create', {
            username: 'kari',
            email: 'kari@osser.jp',
            password1: 'karipwd',
            password2: 'karipwd',
            sex: '不明',
            prefecture: '北海道',
            status: 'ロック',
            isadmin: false,
            isemailauth: false,
            myurl: 'kari-url'
        }, function (err, res, body) {
            var id = body.id;
            gapi.get('/user/find/' + id, function (err, res, body) {
                should.not.exists(err);
                id.should.equal(body.user._id);
                body.user.username.should.equal('kari');
                body.user.email.should.equal('kari@osser.jp');
                body.user.password.should.equal(gfunc.md5('karipwd'));
                body.user.sex.should.equal('不明');
                body.user.prefecture.should.equal('北海道');
                body.user.status.should.equal('ロック');
                body.user.isadmin.should.equal(false);
                body.user.isemailauth.should.equal(false);
                body.user.myurl.should.equal('kari-url');
                body.user.mylogotype.should.equal('Gravatar');
                should.not.exist(body.user.mylogo);
                should.not.exist(body.user.appeal);
                gapi.get('/user/destory/' + id, function (err, res, body) {
                    body.result.should.equal('ok');
                    gapi.get('/user/find/' + id, function (err, res, body) {
                        body.user.status.should.equal('ロック');
                        done();
                    });
                });
            });
        });
    });

    it('ユーザ情報を更新しました', function (done) {
        gapi.post('/user/create', {
            username: 'kari',
            email: 'kari9@osser.jp',
            password1: 'karipwd',
            password2: 'karipwd',
            sex: '不明',
            prefecture: '北海道',
            status: 'ロック',
            isadmin: false,
            isemailauth: false,
            myurl: 'kari-url-891221'
        }, function (err, res, body) {
            var id = body.id;
            gapi.post('/user/update/' + id, {
                username: 'kari01',
                email: 'kari01@osser.jp',
                password: 'xxyyzza',
                sex: '女',
                prefecture: '沖縄県',
                status: 'アクティブ',
                isadmin: true,
                isemailauth: true,
                myurl: 'kari-url-01',
                mylogo: 'mylogo-update',
                mylogotype: '外部リンク',
                appeal: 'appeal-update'
            }, function (err, res, body) {
                body.user.username.should.equal('kari01');
                body.user.email.should.equal('kari01@osser.jp');
                body.user.password.should.equal(gfunc.md5('xxyyzza'));
                body.user.sex.should.equal('女');
                body.user.prefecture.should.equal('沖縄県');
                body.user.status.should.equal('アクティブ');
                body.user.isadmin.should.equal(true);
                body.user.isemailauth.should.equal(true);
                body.user.myurl.should.equal('kari-url-01');
                body.user.mylogo.should.equal('mylogo-update');
                body.user.mylogotype.should.equal('外部リンク');
                body.user.appeal.should.equal('appeal-update');
                gapi.post('/user/findByEmail', {
                    email: 'kari01@osser.jp'
                }, function (err, res, body) {
                    body.user.username.should.equal('kari01');
                    body.user.email.should.equal('kari01@osser.jp');
                    body.user.password.should.equal(gfunc.md5('xxyyzza'));
                    body.user.sex.should.equal('女');
                    body.user.prefecture.should.equal('沖縄県');
                    body.user.status.should.equal('アクティブ');
                    body.user.isadmin.should.equal(true);
                    body.user.isemailauth.should.equal(true);
                    body.user.myurl.should.equal('kari-url-01');
                    body.user.mylogo.should.equal('mylogo-update');
                    body.user.appeal.should.equal('appeal-update');
                    done();
                });
            });
        });
    });

    it('admin-no@osser.jpでメール検索したが、ありませんでした', function (done) {
        gapi.post('/user/findByEmail', {
            email: 'admin-no@osser.jp'
        }, function (err, res, body) {
            should.not.exist(body.user);
            done();
        });
    });

    it('登録入力チェック', function (done) {
        gapi.post('/user/create', {}, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('fail');
            body.errors.username.param.should.equal('username');
            body.errors.username.msg.should.equal(gmsg.mustinput_username);
            body.errors.email.param.should.equal('email');
            body.errors.email.msg.should.equal(gmsg.invalid_email);
            body.errors.sex.param.should.equal('sex');
            body.errors.sex.msg.should.equal(gmsg.mustinput_sex);
            body.errors.prefecture.param.should.equal('prefecture');
            body.errors.prefecture.msg.should.equal(gmsg.mustinput_prefecture);
            body.errors.password1.param.should.equal('password1');
            body.errors.password1.msg.should.equal(gmsg.invalid_password_more6);
            body.errors.password2.param.should.equal('password2');
            body.errors.password2.msg.should.equal(gmsg.invalid_password_more6);
            //body.errors.username.msg.should.equal(gmsg.same_email);
            done();
        });
    });

    it('重複メール登録チェック', function (done) {
        gapi.post('/user/create', {
            username: 'kari',
            email: 'kari-same@osser.jp',
            password1: 'karipwd',
            password2: 'karipwd',
            sex: '不明',
            prefecture: '北海道',
            status: 'ロック',
            isadmin: false,
            isemailauth: false,
            myurl: 'kari-url-8923465'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            gapi.post('/user/create', {
                username: 'kari',
                email: 'kari-same@osser.jp',
                password1: 'karipwd',
                password2: 'karipwd',
                sex: '不明',
                prefecture: '北海道',
                status: 'ロック',
                isadmin: false,
                isemailauth: false,
                myurl: 'kari-url-wer89ew'
            }, function (err, res, body) {
                //console.log(body);
                body.result.should.equal('fail');
                body.errors.email.param.should.equal('email');
                body.errors.email.msg.should.equal(gmsg.same_email);
                body.errors.email.value.should.equal('kari-same@osser.jp');
                done();
            });
        });
    });

    it('パスワード再発行', function (done) {
        gapi.post('/user/create', {
            username: 'kari',
            email: 'kari-recovery@osser.jp',
            password1: 'karipwd',
            password2: 'karipwd',
            sex: '不明',
            prefecture: '北海道',
            status: 'アクティブ',
            isadmin: false,
            isemailauth: false,
            myurl: 'kari-url-8964576'
        }, function (err, res, body) {
            body.result.should.equal('ok');

            gapi.post('/security/recovery', {
                email: 'kari-recovery@osser.jp',
                prefecture: '北海道',
            }, function (err, response, body) {
                body.result.should.equal('ok');

                gapi.post('/security/recovery', {
                    email: 'kari-recovery@osser.jp',
                    prefecture: 'aaa',
                }, function (err, response, body) {
                    body.result.should.equal('fail');

                    gapi.post('/security/recovery', {
                        email: 'kari@osser.jp',
                        prefecture: '北海道',
                    }, function (err, response, body) {
                        body.result.should.equal('fail');
                        done();
                    });
                });
            });
        });
    });

    it('findByMyurl', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-myurl-32840@osser.jp',
            password1: 'aaaaaa',
            password2: 'aaaaaa',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: true,
            myurl: 'admin-url-forfind-7832',
            mylogo: 'mylogo-3782',
            appeal: 'appeal-8921'
        }, function (err, res, body) {
            var id = body.id;
            // idで検索
            gapi.get('/user/findByMyurl/' + id, function (err, res, body) {
                should.not.exists(err);
                id.should.equal(body.user._id);
                body.user.username.should.equal('admin');
                body.user.email.should.equal('admin-myurl-32840@osser.jp');
                body.user.password.should.equal(gfunc.md5('aaaaaa'));
                body.user.sex.should.equal('男');
                body.user.prefecture.should.equal('東京都');
                body.user.status.should.equal('アクティブ');
                body.user.isadmin.should.equal(true);
                body.user.isemailauth.should.equal(true);
                body.user.myurl.should.equal('admin-url-forfind-7832');
                body.user.mylogo.should.equal('mylogo-3782');
                body.user.appeal.should.equal('appeal-8921');
                // myurlで検索
                gapi.get('/user/findByMyurl/' + body.user.myurl, function (err, res, body) {
                    //console.log(body);
                    id.should.equal(body.user._id);
                    body.user.username.should.equal('admin');
                    body.user.email.should.equal('admin-myurl-32840@osser.jp');
                    body.user.password.should.equal(gfunc.md5('aaaaaa'));
                    body.user.sex.should.equal('男');
                    body.user.prefecture.should.equal('東京都');
                    body.user.status.should.equal('アクティブ');
                    body.user.isadmin.should.equal(true);
                    body.user.isemailauth.should.equal(true);
                    body.user.myurl.should.equal('admin-url-forfind-7832');
                    body.user.mylogo.should.equal('mylogo-3782');
                    body.user.appeal.should.equal('appeal-8921');
                    done();
                });
            });
        });
    });

    it('更新項目足りないで、update更新しても、失敗しました。', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-myurl-4932@osser.jp',
            password1: 'aaaaaa',
            password2: 'aaaaaa',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: true,
            myurl: 'admin-url-forfind-4932',
            mylogo: 'mylogo-3782',
            mylogotype: 'Gravatar',
            appeal: 'appeal-8921'
        }, function (err, res, body) {
            var id = body.id;
            gapi.post('/user/update/' + id, {
                username: '',
                email: 'kari01@osser.jp',
                password: 'xza',
                sex: '',
                prefecture: '',
                status: 'アクティブ',
                isadmin: true,
                isemailauth: true,
                myurl: 'kari-url-01',
                mylogo: 'mylogo-update',
                mylogotype: 'Gravatar',
                appeal: 'appeal-update'
            }, function (err, res, body) {
                //console.log(body);
                body.errors.username.msg.should.equal(gmsg.mustinput_username);
                body.errors.password.msg.should.equal(gmsg.invalid_password_more6);
                body.errors.sex.msg.should.equal(gmsg.mustinput_sex);
                body.errors.prefecture.msg.should.equal(gmsg.mustinput_prefecture);
                done();
            });
        });
    });

});