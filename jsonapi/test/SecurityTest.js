var should = require('should');
var gapi = require('../../common').gapi;
var gfunc = require('../../common').gfunc;
var models = require('../api/models');
var User = models.User;
var RecoveryPassword = models.RecoveryPassword;

describe('Security', function () {
    before(function (done) {
        User.remove({}, function (err) {
            done();
        });
    });
    after(function (done) {
        done();
    });
    beforeEach(function (done) {
        done();
    });
    afterEach(function (done) {
        done();
    });

    it('login', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-login@osser.jp',
            password1: 'aabbccd',
            password2: 'aabbccd',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: true,
            myurl: 'admin-url',
            mylogo: 'mylogo-login',
            appeal: 'myappeal-login'
        }, function (err, res, body) {
            if (err) console.error(err);
            var id = body.id;
            gapi.post('/security/login', {
                email: 'admin-login@osser.jp',
                password: 'aabbccd',
                client: {
                    ip: '127.0.0.1',
                    useragent: 'node-request'
                }
            }, function (err, res, body) {
                if (err) console.error(err);
                body.result.should.equal('ok');
                body.uid.should.equal(id);
                body.username.should.equal('admin');
                body.email.should.equal('admin-login@osser.jp');
                body.sex.should.equal('男');
                body.prefecture.should.equal('東京都');
                body.isadmin.should.equal(true);
                body.myurl.should.equal('admin-url');
                body.mylogo.should.equal('mylogo-login');
                body.appeal.should.equal('myappeal-login');
                gapi.post('/security/login', {
                    email: 'admin-login@osser.jp',
                    password: 'aabbccdaaaaaaaaaaaaaaa',
                    client: {
                        ip: '127.0.0.1',
                        useragent: 'node-request'
                    }
                }, function (err, res, body) {
                    body.result.should.equal('fail1');
                    gapi.get('/user/destory/' + id, function (err, res, body) {
                        gapi.post('/security/login', {
                            email: 'admin-login@osser.jp',
                            password: 'aabbccd',
                            client: {
                                ip: '127.0.0.1',
                                useragent: 'node-request'
                            }
                        }, function (err, res, body) {
                            body.result.should.equal('fail2');
                            done();
                        });
                    });
                });
            });
        });
    });

    it('ssologin', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-ssologin@osser.jp',
            password1: 'aabbccd',
            password2: 'aabbccd',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: true,
            myurl: 'admin-url-3289',
            mylogo: 'mylogo-3892',
            appeal: 'myappeal-8932'
        }, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('ok');
            var uid = body.id;
            gapi.post('/security/ssologin', {
                uid: uid
            }, function (err, response, body) {
                if (err) next(err);
                //console.log(body);
                body.username.should.equal('admin');
                body.sex.should.equal('男');
                body.prefecture.should.equal('東京都');
                body.isadmin.should.equal(true);
                body.myurl.should.equal('admin-url-3289');
                body.mylogo.should.equal('mylogo-3892');
                body.appeal.should.equal('myappeal-8932');
                done();
            });
        });
    });

    it('メール未認証のユーザはログインできません', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-login-nomailauth@osser.jp',
            password1: 'aabbccd',
            password2: 'aabbccd',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: false,
            myurl: 'admin-url-66724'
        }, function (err, res, body) {
            if (err) console.error(err);
            var id = body.id;
            gapi.post('/security/login', {
                email: 'admin-login-nomailauth@osser.jp',
                password: 'aabbccd',
                client: {
                    ip: '127.0.0.1',
                    useragent: 'node-request'
                }
            }, function (err, res, body) {
                if (err) console.error(err);
                body.result.should.equal('fail2');
                //console.log(id);
                gapi.post('/security/emailauth/', {
                    uid: id,
                    email: 'admin-login-nomailauth@osser.jp'
                }, function (err, response, body) {
                    //console.log(body);
                    body.result.should.equal('ok');
                    gapi.post('/security/login', {
                        email: 'admin-login-nomailauth@osser.jp',
                        password: 'aabbccd',
                        client: {
                            ip: '127.0.0.1',
                            useragent: 'node-request'
                        }
                    }, function (err, res, body) {
                        body.result.should.equal('ok');
                        gapi.post('/security/emailauth/', {
                            uid: id,
                            email: 'admin-login-nomailauth@osser.jp'
                        }, function (err, response, body) {
                            body.result.should.equal('fail3');
                            done();
                        });
                    });
                });
            });
        });
    });

    it('パスワード再発行', function (done) {
        gapi.post('/user/create', {
            username: 'admin',
            email: 'admin-recoverypassword@osser.jp',
            password1: 'aabbccd',
            password2: 'aabbccd',
            sex: '男',
            prefecture: '東京都',
            status: 'アクティブ',
            isadmin: true,
            isemailauth: false,
            myurl: 'admin-url-89432',
            mylogo: 'mylogo-8932',
            appeal: 'appeal-3892'
        }, function (err, res, body) {
            if (err) console.error(err);
            var id = body.id;
            // emailと都道府県を確認し、認証メールを送る
            gapi.post('/security/recovery', {
                email: 'admin-recoverypassword@osser.jp',
                prefecture: '東京都'
            }, function (err, response, body) {
                body.result.should.equal('ok');
                // 30分以内に認証メールURLをクリックし、リセット画面を出す
                gapi.post('/security/passwordauth', {
                    uid: id
                }, function (err, response, body) {
                    body.result.should.equal('ok');

                    RecoveryPassword.findOne({
                        uid: id
                    }, function (err, newdoc) {
                        should.not.exists(err);
                        newdoc.valid.should.equal(false);
                        // パスワードをリセット
                        gapi.post('/security/password', {
                            id: id,
                            password: 'xxyyzz'
                        }, function (err, response, body) {
                            should.not.exists(err);
                            body.result.should.equal('ok');
                            gapi.get('/user/find/' + id, function (err, res, body) {
                                should.not.exists(err);
                                id.should.equal(body.user._id);
                                body.user.username.should.equal('admin');
                                body.user.email.should.equal('admin-recoverypassword@osser.jp');
                                body.user.password.should.equal(gfunc.md5('xxyyzz'));
                                body.user.sex.should.equal('男');
                                body.user.prefecture.should.equal('東京都');
                                body.user.status.should.equal('アクティブ');
                                body.user.isadmin.should.equal(true);
                                body.user.isemailauth.should.equal(false);
                                body.user.myurl.should.equal('admin-url-89432');
                                body.user.mylogo.should.equal('mylogo-8932');
                                body.user.appeal.should.equal('appeal-3892');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});