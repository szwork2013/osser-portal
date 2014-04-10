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
var validator = require('validator');
var gconfig = require('../../../common').gconfig;
var gapi = require('../../../common').gapi;
var glog = require('../../../common').glog;
var gmsg = require('../../../common').gmsg;
var gdata = require('../../../common').gdata;
var gfunc = require('../../../common').gfunc;
var gmail = require('../../../common').gmail;
var gurl = require('../../../common').gurl;

module.exports = {

    index: function (req, res) {
        res.redirect('/security/login');
    },

    /**
     * Action blueprints:
     *    `/security/login`
     */
    login: function (req, res, next) {
        var back_url = "";
        var form_data = {
            email: req.body.email,
            password: req.body.password,
            recaptcha: req.session.isShowCaptcha ? true : false,
            client: {
                ip: gfunc.getClientIpByProxy(req),
                useragent: req.headers['user-agent']
            }
        };

        switch (req.method) {
        case 'GET':
            clearAllForLogout(req, res);
            back_url = (req.query.back_url === undefined ? '' : req.query.back_url);
            form_data.back_url = back_url;
            return res.view('security/login', {
                title: 'ログイン',
                gconfig: gconfig,
                form: form_data
            });
            break;
        case 'POST':
            back_url = req.body.back_url;
            form_data.back_url = back_url;
            if (req.session.isShowCaptcha) {
                verify_recaptcha(req, function (result, errcode) {
                    if (result) {
                        req.session.isShowCaptcha = false;
                        login_action(req, res, next, form_data);
                    } else {
                        form_data.recaptchamsg = gmsg.invalid_recaptcha;
                        form_data.msg = gmsg.login_failure;
                        return res.view('security/login', {
                            title: 'ログイン',
                            gconfig: gconfig,
                            form: form_data
                        });
                    }
                });
            } else {
                login_action(req, res, next, form_data);
            }
            break;
        default:
            return res.forbidden();
        }
    },

    /**
     * Action blueprints:
     *    `/security/logout`
     */
    logout: function (req, res, next) {
        clearAllForLogout(req, res);
        res.redirect(gconfig.url.nodejs);
    },

    /**
     * Action blueprints:
     *    `/security/signup`
     */
    signup: function (req, res) {
        var form_data = {
            username: req.body.username,
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2,
            sex: req.body.sex,
            prefecture: req.body.prefecture,
            recaptcha: true
        };

        switch (req.method) {
        case 'GET':
            // Send a JSON response
            return res.view('security/signup', {
                title: 'アカウント',
                gconfig: gconfig,
                gdata: gdata,
                form: form_data
            });
            break;
        case 'POST':
            verify_recaptcha(req, function (result, errcode) {
                if (result) {
                    // 登録処理
                    gapi.post(gconfig.site.api.user.create, form_data, function (err, response, body) {
                        if (err) glog.error(err);
                        //console.log(body);
                        switch (body.result) {
                        case 'ok':
                            var regMail = '';
                            regMail += req.body.username + 'さん' + gconfig.string.ENT_KEY;
                            regMail += '' + gconfig.string.ENT_KEY;
                            regMail += gconfig.name + 'ユーザー登録ありがとうございます。' + gconfig.string.ENT_KEY;
                            regMail += '以下のリンクをクリックするか、ブラウザーのアドレスバーにペーストすることでログインできます。' + gconfig.string.ENT_KEY;
                            regMail += '' + gconfig.string.ENT_KEY;
                            regMail += gurl.addhttps(gconfig.url.account) + gconfig.site.account.route.emailauth + '/' + userreg_auth_encode(body.id, req.body.email) + gconfig.string.ENT_KEY;
                            regMail += '' + gconfig.string.ENT_KEY;
                            regMail += 'このリンクを使うと、登録メール認証ページに移動します。このリンクによる会員様はログインできるようになります。' + gconfig.string.ENT_KEY;
                            regMail += '' + gconfig.string.ENT_KEY;
                            regMail += '--  ' + gconfig.name + ' チーム --' + gconfig.string.ENT_KEY;
                            //userreg_auth_decode(userreg_auth_encode(user._id, user.email));
                            gmail.sendsimplemail(req.body.email, gconfig.name + 'のアカウント登録', regMail);

                            req.flash('title', '会員登録完了');
                            req.flash('message', gmsg.result_userreg);
                            return res.redirect('/security/result');
                            break;
                        default:
                            if (body.errors !== undefined) {
                                if (body.errors.username !== undefined)
                                    form_data.usernamemsg = body.errors.username.msg;
                                if (body.errors.email !== undefined)
                                    form_data.emailmsg = body.errors.email.msg;
                                if (body.errors.password1 !== undefined)
                                    form_data.password1msg = body.errors.password1.msg;
                                if (body.errors.password2 !== undefined)
                                    form_data.password2msg = body.errors.password2.msg;
                                if (body.errors.sex !== undefined)
                                    form_data.sexmsg = body.errors.sex.msg;
                                if (body.errors.prefecture !== undefined)
                                    form_data.prefecturemsg = body.errors.prefecture.msg;
                            }
                            return res.view('security/signup', {
                                title: 'アカウント',
                                gconfig: gconfig,
                                gdata: gdata,
                                form: form_data
                            });
                            break;
                        }
                    });
                } else {
                    form_data.recaptchamsg = gmsg.invalid_recaptcha;
                    return res.view('security/signup', {
                        title: 'アカウント',
                        gconfig: gconfig,
                        gdata: gdata,
                        form: form_data
                    });
                }
            });
            break;
        default:
            return res.forbidden();
        }

    },

    emailauth: function (req, res) {
        var authid = req.param('id');
        if (!authid) res.forbidden();
        var result = userreg_auth_decode(authid);

        var arrayOfStrings = result.split(',');
        // console.log(arrayOfStrings);
        if (arrayOfStrings.length == 2) {
            var uid = arrayOfStrings[0];
            var email = arrayOfStrings[1];

            gapi.post(gconfig.site.account.route.emailauth, {
                uid: uid,
                email: email
            }, function (err, response, body) {
                switch (body.result) {
                case 'ok':
                    req.flash('title', '会員登録完了');
                    req.flash('message', gmsg.result_emailauth);
                    return res.redirect('/security/result');
                    break;
                default:
                    res.forbidden();
                    break;
                }
            });
        } else {
            res.forbidden();
        }
    },

    /**
     * Action blueprints:
     *    `/security/recovery`
     */
    recovery: function (req, res, next) {
        var form_data = {
            email: req.body.email,
            prefecture: req.body.prefecture,
            recaptcha: true
        };

        switch (req.method) {
        case 'GET':
            // Send a JSON response
            return res.view('security/recovery', {
                title: 'パスワード再発行',
                gconfig: gconfig,
                gdata: gdata,
                form: form_data
            });
            break;
        case 'POST':
            verify_recaptcha(req, function (result, errcode) {
                if (result) {
                    gapi.post(gconfig.site.account.route.recovery, form_data, function (err, response, body) {
                        if (err) next(err);
                        switch (body.result) {
                        case 'ok':
                            // メール送信
                            var recoveryMail = '';
                            recoveryMail += gconfig.name + 'をご利用いただき、誠にありがとうございます。' + gconfig.string.ENT_KEY;
                            recoveryMail += '' + gconfig.string.ENT_KEY;
                            recoveryMail += 'これは会員様のパスワード再発行案内メールでございます。' + gconfig.string.ENT_KEY;
                            recoveryMail += '以下のリンクをクリックするか、ブラウザーのアドレスバーにペーストすることでアクセスできます。' + gconfig.string.ENT_KEY;
                            recoveryMail += '' + gconfig.string.ENT_KEY;
                            recoveryMail += gurl.addhttps(gconfig.url.account) + gconfig.site.account.route.password + '/' + userreg_auth_encode(body.id, req.body.email) + gconfig.string.ENT_KEY;
                            recoveryMail += '' + gconfig.string.ENT_KEY;
                            recoveryMail += 'このリンクを使うと、パスワードリセットページに移動します。このリンクによる会員様はパスワードリセットできます。' + gconfig.string.ENT_KEY;
                            recoveryMail += '' + gconfig.string.ENT_KEY;
                            recoveryMail += '重要：セキュリティのため、30分以内に再発行手続きをお願いします。' + gconfig.string.ENT_KEY;
                            recoveryMail += '　　※30分以上に過ぎると、上記のリンクは無効になりますので、ご注意ください。' + gconfig.string.ENT_KEY;
                            recoveryMail += '' + gconfig.string.ENT_KEY;
                            recoveryMail += '--  ' + gconfig.name + ' チーム --' + gconfig.string.ENT_KEY;
                            //userreg_auth_decode(userreg_auth_encode(user._id, user.email));
                            gmail.sendsimplemail(req.body.email, gconfig.name + 'のパスワード再発行', recoveryMail);
                            // 完了ページ案内
                            req.flash('title', 'パスワード再発行');
                            req.flash('message', '入力内容が確認できました、パスワード再発行案内メールをお送りしました、ご確認ください。');
                            return res.redirect('/security/result');
                            break;
                        default:
                            req.flash('title', 'パスワード再発行');
                            req.flash('message', '申し訳ございませんが、認証できませんでした。');
                            return res.redirect('/security/result');
                            break;
                        }
                    });
                } else {
                    form_data.recaptchamsg = gmsg.invalid_recaptcha;
                    return res.view('security/recovery', {
                        title: 'パスワード再発行',
                        gconfig: gconfig,
                        gdata: gdata,
                        form: form_data
                    });
                }
            });

            break;
        default:
            return res.forbidden();
            break;
        }
    },

    password: function (req, res, next) {
        var form_data = {
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2,
            authid: req.body.authid
        };
        var authid = req.param('id') || form_data.authid;
        if (validator.trim(authid).length == 0) {
            req.flash('title', 'パスワード再発行');
            req.flash('message', '申し訳ございませんが、パスワード再発行できませんでした。');
            return res.redirect('/security/result');
        }
        var result = userreg_auth_decode(authid);
        var arrayOfStrings = result.split(',');

        if (arrayOfStrings.length == 2) {
            var uid = arrayOfStrings[0];
            var email = arrayOfStrings[1];
            switch (req.method) {
            case 'GET':
                // 認証チェックが必要
                gapi.post(gconfig.site.account.route.passwordauth, {
                    uid: uid
                }, function (err, response, body) {
                    if (err) next(err);
                    switch (body.result) {
                    case 'ok':
                        form_data.authid = authid;
                        // 認証OKだったら、パスワードリセット画面を表示
                        res.view('security/password', {
                            title: 'パスワードリセット',
                            gconfig: gconfig,
                            form: form_data
                        });
                        break;
                    default:
                        return res.forbidden();
                        break;
                    }
                });
                break;
            case 'POST':
                if (email != form_data.email) {
                    req.flash('title', 'パスワード再発行');
                    req.flash('message', '申し訳ございませんが、認証できませんでした。');
                    return res.redirect('/security/result');
                }
                if ((form_data.password1 != form_data.password2) || validator.trim(form_data.password1).length < 6) {
                    req.flash('title', 'パスワード再発行');
                    req.flash('message', '申し訳ございませんが、パスワード再発行ができませんでした。');
                    return res.redirect('/security/result');
                }
                gapi.post(gconfig.site.api.user.update + '/' + uid, {
                    logiccheck: '0',
                    password: form_data.password1
                }, function (err, response, body) {
                    if (err) next(err);
                    switch (body.result) {
                    case 'ok':
                        req.flash('title', 'パスワード再発行');
                        req.flash('message', 'おめでとうございます、パスワードを更新しました。');
                        return res.redirect('/security/result');
                        break;
                    default:
                        sails.log.error(body);
                        req.flash('title', 'パスワード再発行');
                        req.flash('message', '申し訳ございませんが、更新できませんでした。');
                        return res.redirect('/security/result');
                        break;
                    }
                });
                break;
            default:
                res.forbidden();
                break;
            }
        } else {
            res.forbidden();
        }
        //        try {} catch (e) {
        //            res.serverError(e);
        //        }
    },

    /**
     * 処理結果画面
     */
    result: function (req, res) {
        res.view('security/result', {
            title: req.flash('title'),
            message: req.flash('message'),
            gconfig: gconfig
        });
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SecurityController)
     */
    _config: {}


};

/**
 * ユーザ登録 URL暗号化
 */
function userreg_auth_encode(uid, email) {
    var authcode = gfunc.encrypt(uid + ',' + email, gconfig.secret_key);
    return authcode;
}
/**
 * ユーザ登録 URL復号
 */
function userreg_auth_decode(authcode) {
    var result = gfunc.decrypt(authcode, gconfig.secret_key);
    return result;
}
/**
 * captchaチェック
 */
function verify_recaptcha(req, callback) {
    gfunc.verityRecaptcha(req, function (result, errcode) {
        return callback(result, errcode);
    });
}
/**
 * ログイン処理
 */
function login_action(req, res, next, form_data) {
    gapi.post(gconfig.site.api.security.login, form_data, function (err, response, body) {
        if (err) next(err);
        switch (body.result) {
        case 'ok':
            req.session.osser = gfunc.setSSOLoginResult(body);
            gfunc.login(req, res, {
                ver: '1.0.0',
                uid: body.uid,
                clientip: gfunc.getClientIpByProxy(req),
                action: 'loginned'
            });

            if (form_data.back_url)
                return res.redirect(form_data.back_url);
            else
                return res.redirect(gconfig.url.nodejs);
            break;
        default:
            if (body.errors !== undefined) {
                if (body.errors.email !== undefined)
                    form_data.emailmsg = body.errors.email.msg;
                if (body.errors.password !== undefined)
                    form_data.passwordmsg = body.errors.password.msg;
            } else {
                req.session.isShowCaptcha = true;
                form_data.msg = gmsg.login_failure;
            }
            if (req.session.isShowCaptcha)
                form_data.recaptcha = true;
            return res.view('security/login', {
                title: 'ログイン',
                gconfig: gconfig,
                form: form_data
            });
            break;
        }
    });
}

function setCookie(res, name, value) {
    gfunc.setCookie(res, name, value);
}

function clearAllForLogout(req, res) {
    gfunc.logout(req, res);
    //    delete req.session.osser;
    //    setCookie(res, 'osserid', {
    //        action: 'logouted'
    //    });
}