/**
 * SecurityController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var sanitize = require('validator').sanitize;
var glog = require('../../../common').glog;
var gfunc = require('../../../common').gfunc;
var models = require('../models');
var User = models.User;
var LoginHistory = models.LoginHistory;
var RecoveryPassword = models.RecoveryPassword;

module.exports = {


    /**
     * Action blueprints:
     *    `/security/index`
     *    `/security`
     */
    index: function (req, res) {
        //return res.forbidden('You are not permitted to perform this action.');
        res.forbidden();
    },


    /**
     * SSOログイン
     *    `/security/ssologin`
     */
    ssologin: function (req, res) {
        var uid = req.body.uid;
        User.findOne({
            _id: uid
        }, function (err, user) {
            if (err) next(err);
            if (user) {
                return res.json(setLoginResult(user));
            } else {
                glog.warn(sails, 'ssologin認証失敗。[' + JSON.stringify(req.body) + ']');
                return res.json({
                    result: 'fail2'
                });
            }
        });
    },

    /**
     * Action blueprints:
     *    `/security/login`
     */
    login: function (req, res) {

        req.checkBody('email', 'メールアドレスを入力してください。').notEmpty();
        req.checkBody('password', 'パスワードを入力してください。').notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        switch (req.method) {
        case 'POST':
            var email = req.body.email;
            var password = req.body.password;
            User.findOne({
                email: email,
                status: 'アクティブ',
                isemailauth: true
            }, function (err, user) {
                if (err) res.json(err);
                else {
                    if (user) {
                        if (gfunc.md5(password) === user.password) {
                            // ログイン履歴記録
                            new LoginHistory({
                                email: email,
                                ip: req.body.client.ip,
                                useragent: req.body.client.useragent,
                                result: true
                            }).save(function (err) {});
                            return res.json(setLoginResult(user));
                        } else {
                            glog.warn(sails, 'login認証失敗。[' + JSON.stringify(req.body) + ']');
                            // ログイン履歴記録
                            new LoginHistory({
                                email: email,
                                ip: req.body.client.ip,
                                useragent: req.body.client.useragent,
                                result: false
                            }).save(function (err) {});
                            return res.json({
                                result: 'fail1'
                            });
                        }
                    } else {
                        glog.warn(sails, 'login認証失敗。[' + JSON.stringify(req.body) + ']');
                        // ログイン履歴記録
                        new LoginHistory({
                            email: email,
                            ip: req.body.client.ip,
                            useragent: req.body.client.useragent,
                            result: false
                        }).save(function (err) {});
                        return res.json({
                            result: 'fail2'
                        });
                    }
                }
            });
            break;
        default:
            return res.forbidden();
        }
    },

    /**
     * ユーザ登録メール認証
     */
    emailauth: function (req, res, next) {
        var uid = req.body.uid;
        var email = req.body.email;

        User.findOne({
            _id: uid
        }, function (err, user) {
            if (err) next(err);
            if (user) {
                if (user.email == email) {
                    if (user.isemailauth) {
                        // 既に設定済みの場合、fail3を戻す
                        return res.json({
                            result: 'fail3'
                        });
                    }
                    User.findByIdAndUpdate(uid, {
                        $set: {
                            isemailauth: true
                        }
                    }, {}, function (err, newuser) {
                        if (err) next(err);
                        return res.json({
                            result: 'ok'
                        });
                    });
                } else {
                    return res.json({
                        result: 'fail1'
                    });
                }
            } else {
                return res.json({
                    result: 'fail2'
                });
            }
        });
    },

    /**
     * パスワード再発行
     */
    recovery: function (req, res, next) {
        var email = req.body.email;
        var prefecture = req.body.prefecture;

        User.findOne({
            email: email,
            prefecture: prefecture,
            status: 'アクティブ',
        }, function (err, user) {
            if (err) next(err);
            if (user) {
                new RecoveryPassword({
                    uid: user._id
                }).save(function (err, doc) {
                    if (err) next(err);
                    res.json({
                        result: 'ok',
                        id: user._id
                    });
                });
            } else {
                res.json({
                    result: 'fail'
                });
            }
        });
    },

    /**
     * パスワードリセット認証
     * 認証OKだったら、パスワードリセット画面を表示
     */
    passwordauth: function (req, res, next) {
        var uid = req.body.uid;

        RecoveryPassword.findOne({
            uid: uid,
            valid: true
        }, function (err, doc) {
            if (err) next(err);
            if (doc) {
                doc.valid = false;
                doc.save(function (err) {
                    if (err) next(err);
                    res.json({
                        result: 'ok'
                    });
                });
            } else {
                res.json({
                    result: 'fail'
                });
            }
        });
    },

    /**
     * パスワードリセット
     */
    password: function (req, res, next) {
        var id = req.body.id;
        var password = req.body.password;

        User.findByIdAndUpdate(id, {
            $set: {
                password: gfunc.md5(password),
                upddate: new Date()
            }
        }, {}, function (err, user) {
            if (err) next(err);
            res.json({
                result: 'ok'
            });
        });
    },

    /**
     * Action blueprints:
     *    `/security/logout`
     */
    logout: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },




    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SecurityController)
     */
    _config: {},

};

function setLoginResult(user) {
    var loginResult = gfunc.setLoginResult(user);
    loginResult.result = 'ok';
    return loginResult;
}