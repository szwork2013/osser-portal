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
var common = require('../../../common');

module.exports = {


    /**
     * Action blueprints:
     *    `/user/index`
     *    `/user`
     */
    index: function (req, res) {
        return res.json({
            hello: '/user'
        });
    },

    /**
     * 会員ページ
     *  `/user/:myurl`
     */
    find: function (req, res, next) {
        var myurl = req.param('id');
        var action = req.param('action');
        var osser = req.session.osser;
        //自分のページか他人のページかを判断する
        common.gapi.get(common.gconfig.site.api.user.findByMyurl + '/' + myurl, function (err, response, body) {
            if (err) return next(err);
            if (body.result == 'ok') {
                var form_data = common.gfunc.setSSOLoginResult(common.gfunc.setLoginResult(body.user));
                form_data.isself = false;
                if (osser) {
                    if (osser.uid == body.user._id) {
                        form_data.isself = true;
                    }
                }
                form_data.mydrafts = req.flash('mydrafts');
                form_data.mythreads = req.flash('mythreads');
                form_data.myanswers = req.flash('myanswers');
                switch (action) {
                case 'message':
                    if (form_data.isself) {
                        var pageindex = req.param('pageindex');
                        if (pageindex === undefined)
                            pageindex = 1;
                        common.gapi.post(common.gconfig.site.api.message.search, {
                            ftid: body.user._id,
                            isparentonly: true,
                            limit: common.gconfig.pagesize,
                            skip: (pageindex - 1) * common.gconfig.pagesize
                        }, function (err, response, body) {
                            if (err) return next(err);
                            if (body.result === 'ok') {
                                form_data.messages = body.messages;
                                form_data.pager = common.gfunc.getpager(body.count, pageindex);
                                form_data.pager_separator = '';
                                form_data.pager.actionurl = '/user/' + myurl + '/message?pageindex=';
                                form_data.pager.activeindex = pageindex;
                                res.view('home/messagemylist', {
                                    title: 'メッセージ',
                                    gconfig: common.gconfig,
                                    gfunc: common.gfunc,
                                    form: form_data
                                });
                            } else {
                                sails.log.error(body);
                                return res.forbidden();
                            }
                        });
                    } else {
                        return res.redirect(common.gconfig.url.account + common.gconfig.site.account.route.login);
                    }
                    break;
                default:
                    res.view('home/mypage', {
                        title: form_data.username,
                        gconfig: common.gconfig,
                        gfunc: common.gfunc,
                        form: form_data
                    });
                    break;
                }
            } else {
                res.notFound();
            }
        });
    },


    edit: function (req, res, next) {
        switch (req.method) {
        case 'GET':
            //var form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            var form_data = req.session.osser;
            res.view('home/useredit', {
                title: '会員情報編集',
                gconfig: common.gconfig,
                gdata: common.gdata,
                form: form_data,
                msg: ''
            });
            break;
        case 'POST':
            //var form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            var form_data = req.session.osser;

            var password = '';
            var password1 = validator.trim(req.body.password1);
            var password2 = validator.trim(req.body.password2);

            if (password1.length == 0 && password2.length == 0) {
                // password変更なし
            } else {
                if (password1 == password2) {
                    password = password1;
                } else {
                    form_data.password1msg = common.gmsg.invalid_password_nosame;
                    form_data.password2msg = common.gmsg.invalid_password_nosame;
                    return res.view('home/useredit', {
                        title: '会員情報編集',
                        gconfig: common.gconfig,
                        gdata: common.gdata,
                        form: form_data,
                        msg: ''
                    });
                }
            }
            common.gapi.post(common.gconfig.site.api.user.update + '/' + form_data.uid, {
                username: req.body.username,
                sex: req.body.sex,
                prefecture: req.body.prefecture,
                appeal: req.body.appeal,
                password: password,
                homepage: req.body.homepage
            }, function (err, response, body) {
                if (err) next(err);
                if (body.errors !== undefined) {
                    if (body.errors.username !== undefined)
                        form_data.usernamemsg = body.errors.username.msg;
                    if (body.errors.password !== undefined) {
                        form_data.password1msg = body.errors.password.msg;
                        form_data.password2msg = body.errors.password.msg;
                    }
                    if (body.errors.sex !== undefined)
                        form_data.sexmsg = body.errors.sex.msg;
                    if (body.errors.prefecture !== undefined)
                        form_data.prefecturemsg = body.errors.prefecture.msg;
                    return res.view('home/useredit', {
                        title: '会員情報編集',
                        gconfig: common.gconfig,
                        gdata: common.gdata,
                        form: form_data,
                        msg: ''
                    });
                }
                common.gapi.post(common.gconfig.site.api.security.ssologin, {
                    uid: body.user._id
                }, function (err, response, body) {
                    //console.log('ssoログイン');
                    if (err) next(err);
                    if (body.result == 'ok') {
                        req.session.osser = common.gfunc.setSSOLoginResult(body);
                        //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                        form_data = req.session.osser;
                    }
                    return res.view('home/useredit', {
                        title: '会員情報編集',
                        gconfig: common.gconfig,
                        gdata: common.gdata,
                        form: form_data,
                        msg: '会員情報を更新しました。'
                    });
                });
            });
            break;
        default:
            return res.notFound();
            break;
        }
    },

    editlogo: function (req, res) {
        var form_data = {};
        switch (req.method) {
        case 'GET':
            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            form_data = req.session.osser;
            return res.view('home/usereditlogo', {
                title: '会員ロゴ変更',
                gconfig: common.gconfig,
                gdata: common.gdata,
                gfunc: common.gfunc,
                form: form_data,
                msg: ''
            });
            break;
        case 'POST':
            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            form_data = req.session.osser;
            var mylogo = req.body.mylogo;
            var mylogotype = req.body.mylogotype;
            var selmylogo = req.body.selmylogo;
            common.gapi.post(common.gconfig.site.api.user.update + '/' + form_data.uid, {
                mylogo: mylogo,
                mylogotype: mylogotype,
                selmylogo: selmylogo,
                logiccheck: '0'
            }, function (err, response, body) {
                if (err) next(err);
                common.gapi.post(common.gconfig.site.api.security.ssologin, {
                    uid: body.user._id
                }, function (err, response, body) {
                    if (err) next(err);
                    if (body.result == 'ok') {
                        req.session.osser = common.gfunc.setSSOLoginResult(body);
                        //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                        form_data = req.session.osser;
                    }
                    return res.view('home/usereditlogo', {
                        title: '会員ロゴ変更',
                        gconfig: common.gconfig,
                        gdata: common.gdata,
                        gfunc: common.gfunc,
                        form: form_data,
                        msg: '会員ロゴを更新しました。'
                    });
                });
            });
            break;
        default:
            return res.forbidden();
            break;
        }
    },

    editurl: function (req, res) {
        var form_data = {};
        switch (req.method) {
        case 'GET':
            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            form_data = req.session.osser;
            common.gapi.get(common.gconfig.site.api.user.find + '/' + form_data.uid, function (err, response, body) {
                if (err) return next(err);
                if (body.result === 'ok') {
                    if (body.user.myurl) {
                        form_data.myurl_disable = "disabled";
                    } else {
                        form_data.myurl_disable = "";
                    }
                    return res.view('home/userediturl', {
                        title: 'myurl変更',
                        gconfig: common.gconfig,
                        form: form_data,
                        msg: ''
                    });
                } else {
                    return res.forbidden();
                }
            });
            break;
        case 'POST':
            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            form_data = req.session.osser;
            var myurl = encodeURIComponent(validator.trim(req.body.myurl));
            if (myurl.length == 0) {
                form_data.myurlmsg = common.gmsg.mustinput_content;
                return res.view('home/userediturl', {
                    title: '会員myurl変更',
                    gconfig: common.gconfig,
                    form: form_data,
                    msg: ''
                });
            }
            common.gapi.get(common.gconfig.site.api.user.find + '/' + form_data.uid, function (err, response, body) {
                if (err) return next(err);
                //-------------------------------//
                // myurlまだ設定されてないチェック
                //-------------------------------//
                //console.log('body.user.myurl:' + body.user.myurl);
                // 既に設定済みだったら、アクセス不可にする
                if (body.user.myurl) {
                    return res.forbidden();
                }
                //-------------------------------//
                // myurl重複チェック
                //-------------------------------//
                common.gapi.get(common.gconfig.site.api.user.findByMyurl + '/' + myurl, function (err, response, body) {
                    //console.log(body);
                    if (body.result === 'ok') {
                        if (body.user) {
                            // 既に存在済みなので、再入力を促す
                            form_data.myurlmsg = 　myurl + common.gmsg.result_myurl_failure;
                            return res.view('home/userediturl', {
                                title: '会員myurl変更',
                                gconfig: common.gconfig,
                                form: form_data,
                                msg: ''
                            });
                        } else {
                            // myurl更新処理へ
                            common.gapi.post(common.gconfig.site.api.user.update + '/' + form_data.uid, {
                                myurl: myurl,
                                logiccheck: '0'
                            }, function (err, response, body) {
                                if (err) return next(err);
                                common.gapi.post(common.gconfig.site.api.security.ssologin, {
                                    uid: body.user._id
                                }, function (err, response, body) {
                                    if (err) next(err);
                                    if (body.result == 'ok') {
                                        req.session.osser = common.gfunc.setSSOLoginResult(body);
                                        //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                                        form_data = req.session.osser;
                                    }
                                    form_data.myurl_disable = "disabled";
                                    return res.view('home/userediturl', {
                                        title: '会員myurl変更',
                                        gconfig: common.gconfig,
                                        gdata: common.gdata,
                                        form: form_data,
                                        msg: '会員myurlを更新しました。'
                                    });
                                });
                            });
                        }
                    } else {
                        //console.error(body);
                        form_data.myurlmsg = common.gmsg.result_update_failure;
                        return res.view('home/userediturl', {
                            title: '会員myurl変更',
                            gconfig: common.gconfig,
                            form: form_data,
                            msg: ''
                        });
                    }
                });
            });
            break;
        default:
            return res.forbidden();
            break;
        }

    },


    editjob: function (req, res) {
        var form_data = {};
        switch (req.method) {
        case 'GET':
            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            form_data = req.session.osser;
            form_data.jobtypemsg = '';
            return res.view('home/usereditjob', {
                title: '経験職種',
                gconfig: common.gconfig,
                gdata: common.gdata,
                gfunc: common.gfunc,
                form: form_data,
                msg: ''
            });
            break;
        case 'POST':
            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
            form_data = req.session.osser;
            form_data.jobtypemsg = '';

            var jobtype = req.body.jobtype;
            var jobstatus = req.body.jobstatus;
            var jobyears = req.body.jobyears;
            var devplatform = req.body.devplatform;
            var specializedarea = req.body.specializedarea;
            // myurl更新処理へ
            common.gapi.post(common.gconfig.site.api.user.update + '/' + form_data.uid, {
                jobtype: jobtype,
                jobstatus: jobstatus,
                jobyears: jobyears,
                devplatform: devplatform,
                specializedarea: specializedarea,
                logiccheck: '0'
            }, function (err, response, body) {
                if (err) return next(err);
                if (body.result === 'ok') {
                    common.gapi.post(common.gconfig.site.api.security.ssologin, {
                        uid: body.user._id
                    }, function (err, response, body) {
                        if (err) next(err);
                        if (body.result == 'ok') {
                            req.session.osser = common.gfunc.setSSOLoginResult(body);
                            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                            form_data = req.session.osser;
                            form_data.jobtypemsg = '';
                        }
                        return res.view('home/usereditjob', {
                            title: '経験職種',
                            gconfig: common.gconfig,
                            gdata: common.gdata,
                            gfunc: common.gfunc,
                            form: form_data,
                            msg: '経験職種を更新しました。'
                        });
                    });
                } else {
                    console.error(body.err);
                    return res.forbidden();
                }
            });

            break;
        default:
            break;
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UserController)
     */
    _config: {}


};