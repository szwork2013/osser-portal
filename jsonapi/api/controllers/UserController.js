/**
 * UserController
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
var validator = require('validator');
var async = require('async');
var gfunc = require('../../../common').gfunc;
var gmsg = require('../../../common').gmsg;
var glog = require('../../../common').glog;
var models = require('../models');
var User = models.User;

module.exports = {

    index: function (req, res) {
        // Send a JSON response
        return res.json({
            result: 'ok'
        });
    },

    /**
     * Action blueprints:
     *    `/user/create`
     */
    create: function (req, res) {

        req.checkBody('username', gmsg.mustinput_username).notEmpty();
        req.checkBody('email', gmsg.mustinput_email).notEmpty();
        req.checkBody('email', gmsg.invalid_email).isEmail();
        req.checkBody('sex', gmsg.mustinput_sex).notEmpty();
        req.checkBody('prefecture', gmsg.mustinput_prefecture).notEmpty();
        req.checkBody('password1', gmsg.mustinput_password1).notEmpty();
        req.checkBody('password2', gmsg.mustinput_password2).notEmpty();

        // パスワードは6桁以上入力チェック
        req.checkBody('password1', gmsg.invalid_password_more6).len(6, 32);
        req.checkBody('password2', gmsg.invalid_password_more6).len(6, 32);
        // パスワードのどちらか入力された場合、パスワード整合性チェックを行う
        if (req.body.password1 != req.body.password2) {
            if (req._validationErrors === undefined) {
                req._validationErrors = [];
            }
            req._validationErrors.push({
                param: 'password1',
                msg: gmsg.invalid_password_nosame,
                value: req.body.password1
            });
            req._validationErrors.push({
                param: 'password2',
                msg: gmsg.invalid_password_nosame,
                value: req.body.password2
            });
        }
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        async.waterfall([

            function (cb_done) {
                // メール重複チェック
                User.findOne({
                    email: req.body.email
                }, cb_done);
            }
        ], function (err, result) {
            // ユーザ登録
            if (result) {
                // 既に存在している
                if (req._validationErrors === undefined) {
                    req._validationErrors = [];
                }
                req._validationErrors.push({
                    param: 'email',
                    msg: gmsg.same_email,
                    value: req.body.email
                });
                var errors = req.validationErrors(true);
                if (errors) {
                    return res.json({
                        result: 'fail',
                        errors: errors
                    });
                }
            } else {
                var user = {
                    username: req.body.username,
                    email: req.body.email,
                    password: gfunc.md5(req.body.password1),
                    sex: req.body.sex,
                    prefecture: req.body.prefecture,
                    status: req.body.status === undefined ? 'アクティブ' : req.body.status,
                    isadmin: req.body.isadmin === undefined ? false : req.body.isadmin,
                    isemailauth: req.body.isemailauth === undefined ? false : req.body.isemailauth,
                    myurl: req.body.myurl,
                    //mylogo: req.body.mylogo,
                    mylogo: gfunc.getRandomPersonalLogo(),
                    mylogotype: req.body.mylogotype === undefined ? 'サイト画像' : req.body.mylogotype,
                    appeal: req.body.appeal,
                    homepage: req.body.homepage,
                    jobtype: req.body.jobtype,
                    jobstatus: req.body.jobstatus,
                    jobyears: req.body.jobyears
                };
                new User(user).save(function (err, doc) {
                    if (err)
                        res.json({
                            result: 'fail',
                            err: err
                        });
                    else
                        res.json({
                            result: 'ok',
                            id: doc._id
                        });
                });
            }
        });
    },


    /**
     * Action blueprints:
     *    `/user/find`
     */
    find: function (req, res) {
        var id = req.param('id');
        User.findOne({
            _id: id
        }, function (err, doc) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else
                res.json({
                    result: 'ok',
                    user: doc
                });
        });
    },


    /**
     * Action blueprints:
     *    `/user/update`
     */
    update: function (req, res) {
        glog.debug(sails, JSON.stringify(req.body));

        // ロジックチェックをしない
        if (req.body.logiccheck == '0') {

        } else {
            req.checkBody('username', gmsg.mustinput_username).notEmpty();
            req.checkBody('sex', gmsg.mustinput_sex).notEmpty();
            req.checkBody('prefecture', gmsg.mustinput_prefecture).notEmpty();
            var password = validator.trim(req.body.password);
            if (password.length > 0)
                req.checkBody('password', gmsg.invalid_password_more6).len(6, 32);
            var errors = req.validationErrors(true);
            if (errors) {
                return res.json({
                    result: 'fail',
                    errors: errors
                });
            }
        }
        var id = req.param('id');
        User.findOne({
            _id: id
        }, function (err, user) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else {
                if (user) {
                    if (req.body.username !== undefined)
                        user.username = req.body.username;
                    if (req.body.email !== undefined)
                        user.email = req.body.email;
                    if (req.body.password !== undefined && validator.trim(req.body.password).length > 0)
                        user.password = gfunc.md5(req.body.password);
                    if (req.body.sex !== undefined)
                        user.sex = req.body.sex;
                    if (req.body.prefecture !== undefined)
                        user.prefecture = req.body.prefecture;
                    if (req.body.status !== undefined)
                        user.status = req.body.status;
                    if (req.body.isadmin !== undefined)
                        user.isadmin = req.body.isadmin;
                    if (req.body.isemailauth !== undefined)
                        user.isemailauth = req.body.isemailauth;
                    if (req.body.myurl !== undefined)
                        user.myurl = req.body.myurl;
                    if (req.body.mylogo !== undefined)
                        user.mylogo = req.body.mylogo;
                    if (req.body.mylogotype !== undefined && validator.trim(req.body.mylogotype).length > 0) {
                        user.mylogotype = req.body.mylogotype;
                        if (req.body.mylogotype === 'サイト画像')
                            user.mylogo = req.body.selmylogo;
                    }
                    if (req.body.appeal !== undefined)
                        user.appeal = req.body.appeal;
                    if (req.body.homepage !== undefined)
                        user.homepage = req.body.homepage;
                    if (req.body.jobtype !== undefined)
                        user.jobtype = req.body.jobtype;
                    if (req.body.jobstatus !== undefined)
                        user.jobstatus = req.body.jobstatus;
                    if (req.body.jobyears !== undefined)
                        user.jobyears = req.body.jobyears;
                    if (req.body.devplatform !== undefined)
                        user.devplatform = req.body.devplatform;
                    if (req.body.specializedarea !== undefined)
                        user.specializedarea = req.body.specializedarea;

                    user.upddate = new Date();
                    user.save(function (err, doc) {
                        if (err) res.json({
                            result: 'fail',
                            err: err
                        });
                        else {
                            res.json({
                                result: 'ok',
                                user: doc
                            });
                        }
                    });
                } else {
                    res.json({
                        result: 'data is null'
                    });
                }
            }
        });
    },


    /**
     * Action blueprints:
     *    `/user/destory`
     */
    destory: function (req, res) {
        var id = req.param('id');
        User.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                status: 'ロック'
            }
        }, {
            new: true,
            upsert: false
        }, function (err) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else
                res.json({
                    result: 'ok'
                });
        });
    },


    /**
     * メールでユーザ抽出
     */
    findByEmail: function (req, res) {
        var email = req.param('email');
        User.findOne({
            email: email
        }, function (err, doc) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else
                res.json({
                    result: 'ok',
                    user: doc
                });
        });
    },

    /**
     * myurlでユーザ抽出
     */
    findByMyurl: function (req, res) {
        var myurl = req.param('id');
        var searchConditions = {};

        if (models.isObjectId(myurl)) {
            searchConditions = {
                $or: [{_id: myurl}, {myurl: myurl}]
            };
        } else {
            searchConditions = {
                myurl: myurl
            };
        }

        User.findOne(searchConditions, function (err, doc) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else
                res.json({
                    result: 'ok',
                    user: doc
                });
        });
    },

    /**
     * 経験値を追加
     */
    addExperience: function (req, res) {
        var id = req.param('id');
        if (id) {
            var updOption = {
                $inc: {
                    "experience": req.body.experience
                }
            };
            switch (req.body.experience) {
            case 1: // コメント
                updOption.$inc.commentcount = 1;
                break;
            case 10: // 投稿
                updOption.$inc.threadcount = 1;
                break;
            default:
                break;
            }
            //console.log(updOption);
            User.findOneAndUpdate({
                _id: id
            }, updOption, {
                new: true,
                upsert: false
            }, function (err) {
                if (err)
                    res.json({
                        result: 'fail',
                        err: err
                    });
                else
                    res.json({
                        result: 'ok'
                    });
            });
        } else {
            res.json({
                result: 'fail',
                err: 'id is null.'
            });
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UserController)
     */
    _config: {}


};