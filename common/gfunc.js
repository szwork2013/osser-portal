var crypto = require('crypto');
var querystring = require("querystring");
var Recaptcha = require('recaptcha').Recaptcha;
var gconfig = require('./gconfig').config;
var gdata = require('./gdata');
var request = require('request');
var gravatar = require('gravatar');
var urlencode = require('urlencode');
var hljs = require('highlight.js');

//console.log(gconfig);

/**
 * 開発機判定
 */
exports.isLocalMachine = function (req) {
    if (req.ip == '127.0.0.1')
        return true;
    else
        return false;
};

/**
 * クライアントIP取得
 */
exports.getClientIpByProxy = function (request) {
    var retval = "";

    if (request["headers"] && request["headers"]["x-forwarded-for"]) {
        // Proxied request
        retval = request["headers"]["x-forwarded-for"];
    } else if (request["socket"] && request["socket"]["remoteAddress"]) {
        // Direct request
        retval = request["socket"]["remoteAddress"];
    } else if (request["socket"] && request["socket"]["socket"] && request["socket"]["socket"]["remoteAddress"]) {
        // God only knows what happened here...
        retval = request["socket"]["socket"]["remoteAddress"];
    }
    return (retval);
};

exports.encrypt = function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

exports.decrypt = function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

exports.randomString = function (size) {
    size = size || 6;
    var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var max_num = code_string.length + 1;
    var new_pass = '';
    while (size > 0) {
        new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
        size--;
    }
    return new_pass;
};

exports.startsWith = startsWith;

function startsWith(str, prefix) {
    return str.indexOf(prefix) == 0;
}

exports.endsWith = endsWith;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

//exports.trim = function trim(str) {
//    return str.replace(/^\s+|\s+$/g, "");
//};
/*
exports.getRecaptchaHtml = function () {
    //    console.log(Recaptcha);
    //    console.log(require('./gconfig').config);
    //    console.log(gconfig);
    //    var recaptcha = new Recaptcha(gconfig.recaptcha.PUBLIC_KEY, gconfig.recaptcha.PRIVATE_KEY);
    //    return recaptcha.toHTML();
    return 'true';
};
*/
exports.verityRecaptcha = function (req, callback) {
    var data = {
        privatekey: gconfig.recaptcha.PRIVATE_KEY,
        remoteip: req.connection.remoteAddress,
        challenge: req.body.recaptcha_challenge_field,
        response: req.body.recaptcha_response_field
    };
    //console.log('verityRecaptcha.data=' + JSON.stringify(data));

    var options = {
        uri: gconfig.url.others.google_recaptcha_verify,
        headers: {
            'User-Agent': 'nodejs-request',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: data
    };

    request.post(options, function (err, response, body) {
        if (err) console.error(err);
        //console.log('verityRecaptcha.body=' + body);
        var success, error_code, parts;
        parts = body.split('\n');
        success = parts[0];
        error_code = parts[1];
        return callback(success === 'true', error_code);
    });
};

exports.setCookie = setCookie;

function setCookie(res, name, value) {
    setCookieWithPath(res, '/', name, value);
};


exports.setCookieWithPath = setCookieWithPath;

function setCookieWithPath(res, path, name, value) {
    var options = gconfig.cookie_opts;
    options.path = path;
    //console.log(options);
    res.cookie(name, value, options);
};

/**
 * アカウントログインクーキー設定処理
 */
exports.login = function (req, res, osser_cookie_data) {
    setCookie(res, 'osserid', osser_cookie_data);
};
/**
 * 各サイト共通ログイン処理
 */
exports.logout = function (req, res) {
    delete req.session.osser;
    //res.clearCookie('osserid');
    setCookieWithPath(res, '/', 'osserid', {
        action: 'logouted'
    });
};

exports.getGravatarUrl = getGravatarUrl;

function getGravatarUrl(email) {
    // doc:http://en.gravatar.com/site/implement/images/
    var options = {
        s: '56',
        r: 'pg'
        //        d: urlencode(gconfig.url.nodejs + gconfig.url.image.osser_logo)
    };
    var mylogo = gravatar.url(email, options);
    return mylogo;
};

/**
 * ログイン情報設定(jsonapi利用)
 */
exports.setLoginResult = function (user) {
    //console.log('gfunc.setLoginResult:' + JSON.stringify(user));
    return {
        result: 'ok',
        uid: user._id,
        username: user.username,
        email: user.email,
        sex: user.sex,
        experience: user.experience,
        prefecture: user.prefecture,
        isadmin: user.isadmin,
        myurl: user.myurl,
        regdate: user.regdate,
        mylogo: user.mylogo,
        mylogotype: user.mylogotype,
        appeal: user.appeal,
        threadcount: user.threadcount,
        commentcount: user.commentcount,
        homepage: user.homepage,
        jobtype: user.jobtype,
        jobstatus: user.jobstatus,
        jobyears: user.jobyears,
        devplatform: user.devplatform,
        specializedarea: user.specializedarea
    };
};

/**
 * SSOログイン情報設定(各サイト利用、例：nodejs.osser.jp)
 */
exports.setSSOLoginResult = function (body) {
    return {
        uid: body.uid,
        username: body.username,
        email: body.email,
        sex: body.sex,
        experience: body.experience,
        prefecture: body.prefecture,
        isadmin: body.isadmin,
        myurl: getmyurl(body),
        regdate: body.regdate,
        mylogo: getautomylogo(body),
        mylogotype: body.mylogotype,
        appeal: body.appeal,
        threadcount: body.threadcount,
        commentcount: body.commentcount,
        homepage: body.homepage,
        jobtype: body.jobtype,
        jobstatus: body.jobstatus,
        jobyears: body.jobyears,
        devplatform: body.devplatform,
        specializedarea: body.specializedarea
    };
};
// auto.mylogo
exports.getautomylogo = getautomylogo;

function getautomylogo(body) {
    var result = '';
    switch (body.mylogotype) {
    case 'Gravatar':
        result = getGravatarUrl(body.email);
        break;
    case 'サイト画像':
        // SSOログイン後、ロジックパスを付与する、DBにはファイル名のみ保存する
        result = body.mylogo ? '/images/avatar/' + body.mylogo : gconfig.url.image.osser_logo;
        //result = body.mylogo ? (startsWith(body.mylogo, '/images/avatra/') ? body.mylogo : '/images/avatar/' + body.mylogo) : gconfig.url.image.osser_logo;
        //result = body.mylogo ? body.mylogo : gconfig.url.image.osser_logo;
        break;
    case '外部リンク':
        result = body.mylogo ? body.mylogo : gconfig.url.image.osser_logo;
        break;
    default:
        result = gconfig.url.image.osser_logo;
        break;
    }
    //return body.mylogotype === 'Gravatar' ? getGravatarUrl(body.email) : (body.mylogo ? body.mylogo : gconfig.url.image.osser_logo);
    return result;
}

exports.getmyurl = getmyurl;

function getmyurl(body) {
    //console.log('getmyurl:' + JSON.stringify(body));
    return body.myurl === undefined ? (body.uid === undefined ? body._id : body.uid) : body.myurl;
}

//exports.getmylogopath = getmylogopath;
//function getmylogopath(avatarurl) {
//    return '/images/avatar/' + avatarurl;
//}

// req.flashから[0]値を取得
exports.getflash = function (req, key) {
    var content = req.flash(key);
    content = content.length > 0 ? content[0] : '';
    return content;
};

exports.format_date = format_date;

function format_date(date, friendly) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (friendly) {
        var now = new Date();
        var mseconds = -(date.getTime() - now.getTime());
        var time_std = [1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000];
        if (mseconds < time_std[3]) {
            if (mseconds > 0 && mseconds < time_std[1]) {
                return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
            }
            if (mseconds > time_std[1] && mseconds < time_std[2]) {
                return Math.floor(mseconds / time_std[1]).toString() + ' 分前';
            }
            if (mseconds > time_std[2]) {
                return Math.floor(mseconds / time_std[2]).toString() + ' 時間前';
            }
        }
    }

    //month = ((month < 10) ? '0' : '') + month;
    //day = ((day < 10) ? '0' : '') + day;
    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0' : '') + second;

    var thisYear = new Date().getFullYear();
    year = (thisYear === year) ? '' : (year + '年');
    //return year + month + '月' + day + '日' + hour + '時' + minute + '分';
    return year + month + '月' + day + '日';
};

exports.format_datestring = function (datestring, friendly) {
    return format_date(new Date(datestring), friendly);
};


exports.getpager = function (allcount, activeindex, pagesize, pagersize) {
    allcount = Number(allcount);
    activeindex = Number(activeindex);
    if (pagesize === undefined)
        pagesize = gconfig.pagesize;
    else
        pagesize = Number(pagesize);
    if (pagersize === undefined)
        pagersize = gconfig.pagersize;
    else
        pagersize = Number(pagersize);

    var pager = {
        // <<ボタン-最初ページ
        // 最初のページインデックスです、常に１になります。
        // 0に設定したら、非表示にします
        first: 0,
        // ページャー配列
        // 例1：[1,2,3,4,5,6,7]
        // 例2：[11,12,13,14,15,16,17]
        // activeindexは常に真ん中に入ります
        pages: [],
        // >>ボタン-最後ページ
        // 最後のページインデックスです、最大ページを指します
        // 0に設定したら、非表示にします
        last: 0
    };

    var pagecount = 1;
    if (allcount > 0)
        pagecount = Math.ceil(allcount / pagesize);
    //pagecount = Math.ceil(allcount / pagesize) + (allcount % pagesize == 0 ? 0 : 0);
    if (pagecount <= pagersize) {
        pager.first = 0;
        pager.last = 0;
        for (var i = 1; i <= pagecount; i++) {
            pager.pages.push(i);
        }
    } else {
        if (activeindex < 0) activeindex = 0;
        else if (activeindex > pagecount) activeindex = pagecount;
        var middle = (pagersize + 1) / 2;
        if (activeindex <= middle) {
            // 1,2,3,4
            pager.first = 0;
            pager.last = pagecount;
            for (var i = 1; i <= pagersize; i++) {
                pager.pages.push(i);
            }
        } else if (activeindex > pagecount - middle) {
            // 97,98,99,100
            pager.first = 1;
            pager.last = 0;
            for (var i = pagecount; i > pagecount - pagersize; i--) {
                pager.pages.push(i);
            }
            pager.pages.reverse();
        } else {
            // 10,11,12,13,14,15,16
            pager.first = 1;
            pager.last = pagecount;
            for (var i = activeindex - middle + 1; i <= activeindex + middle - 1; i++) {
                pager.pages.push(i);
            }
        }
    }
    return pager;
};

exports.cloneObj = cloneObj;

function cloneObj(obj) {
    var f = function () {};
    f.prototype = obj;
    return new f;
}

exports.escapehtml_entkey = function (content) {
    if (content)
        return content.replace('\r\n', '<br/>');
    else
        return '';
};

/**
 * highlight.jsコード変換
 */
exports.convertHighlightJS = function (code) {
    return hljs.highlightAuto(code).value;
};

/**
 * コンテンツノードURL取得
 */
exports.getContentNodeUrl = function (cnode) {
    return cnode.url ? cnode.url : cnode._id;
}

/**
 * 個人ロゴランダムで作成
 */
exports.getRandomPersonalLogo = function () {
    return gdata.personallogos[Math.floor(Math.random() * gdata.personallogos.length)];
}

/**
 * book-url取得
 */
exports.getBookUrl = function (book) {
    if (book.alias) {
        return gconfig.url.redirect + '/book/' + book.alias;
    } else {
        return book.link;
    }
}