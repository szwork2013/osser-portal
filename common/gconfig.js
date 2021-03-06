var fs = require('fs');
var path = require('path');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname + '', 'package.json')));
//var glog = require('./glog');
var local = require('./local').config;

var config = {
    // 基本情報
    name: 'オープンソーサー・日本',
    description: 'オープンソースソフトウェア紹介・IT技術者コミュニティ・情報交換プラットフォーム',
    homesite: "http://osser.jp",
    author: 'コマ',
    version: pkg.version,
    secret_key: local.secret_key,

    // 一ページに表示するデータ行数（スレッド、投稿など）
    pagesize: 25,
    // ページャ表示サイズ（例：7→<<1234567>>）
    pagersize: 7,

    db: {
        osser: local.db.osser,
        sess_account: local.db.sess_account,
        sess_nodejs: local.db.sess_nodejs
    },

    // メール設定
    mail_opts: {
        host: local.mail_opts.host,
        port: 587,
        port_ssl: 465,
        auth: {
            user: local.mail_opts.auth.user,
            pass: local.mail_opts.auth.pass
        },
        admin_mail: local.mail_opts.admin_mail, // 業務用
        system_mail: local.mail_opts.system_mail // システム用
    },

    url: {
        nodejs: '//nodejs.osser.jp',
        account: '//account.osser.jp',
        redirect: 'http://r.osser.jp',
        api: 'http://127.0.0.1:8080',
        osser: '//osser.jp',
        oldosser: '//old.osser.jp',
        admin: '//admin.ossser.jp',
        resource: '//resource.osser.jp',
        book: '//book.osser.jp',
        tools: '//tools.osser.jp',
        sample: '//sample.osser.jp',

        // 各サイト共通URL
        image: {
            osser: '/images/osser.png',
            osser_logo: '/images/osser-logo.png',
            nodejs: '/images/nodejs-logo-light.png'
        },
        others: {
            google_recaptcha_verify: 'https://www.google.com/recaptcha/api/verify',
            github_osser: 'https://github.com/osser'
        }
    },

    site: {
        api: {
            name: 'OSSER-JSON-API',
            user: {
                create: '/user/create',
                update: '/user/update',
                find: '/user/find',
                findByEmail: '/user/findByEmail',
                findByMyurl: '/user/findByMyurl',
                addExperience: '/user/addExperience'
            },
            security: {
                login: '/security/login',
                ssologin: '/security/ssologin'
            },
            thread: {
                create: '/thread/create',
                find: '/thread/find',
                findBynid: '/thread/findBynid',
                update: '/thread/update',
                updatebookey: '/thread/updatebookey',
                destory: '/thread/destory',
                search: '/thread/search',
                searchFromComment: '/thread/searchFromComment',
                count: '/thread/count'
            },
            contentnode: {
                update: '/contentnode/update'
            },
            comment: {
                create: '/comment/create',
                find: '/comment/find',
                //update: '/comment/update',
                destory: '/comment/destory',
                search: '/comment/search'
            },
            message: {
                create: '/message/create',
                find: '/message/find',
                destory: '/message/destory',
                search: '/message/search'
            },
            tag: {
                create: '/tag/create',
                find: '/tag/find',
                update: '/tag/update',
                destory: '/tag/destory',
                search: '/tag/search'
            },
            newsfeed: {
                create: '/newsfeed/create',
                destory: '/newsfeed/destory',
                search: '/newsfeed/search',
                update: '/newsfeed/update'
            },
            feednews: {
                create: '/feednews/create',
                find: '/feednews/find',
                search: '/feednews/search'
            },
            book: {
                create: '/book/create',
                find: '/book/find',
                search: '/book/search',
                update: '/book/update'
            },
            amzbrowsenode: {
                create: '/amzbrowsenode/create',
                find: '/amzbrowsenode/find',
                search: '/amzbrowsenode/search',
                update: '/amzbrowsenode/update',
                remove: '/amzbrowsenode/remove'
            },
            amzbooknode: {
                create: '/amzbooknode/create',
                remove: '/amzbooknode/remove',
                find: '/amzbooknode/find',
                search: '/amzbooknode/search',
                update: '/amzbooknode/update'
            },
            searchresult: {
                create: '/searchresult/create',
                search: '/searchresult/search'
            }
        },
        account: {
            name: 'アカウント統一管理',
            route: {
                login: '/security/login',
                logout: '/security/logout',
                signup: '/security/signup',
                emailauth: '/security/emailauth',
                recovery: '/security/recovery',
                password: '/security/password',
                passwordauth: '/security/passwordauth'
            }
        },
        nodejs: {
            name: 'コミュニティ・日本',
            route: {
                nodejs: '/nodejs',
                books: '/books',
                helpmarkdown: '/help/markdown',
                search: '/search',
                news: '/news',
                newssearch: '/news/search',
                user: '/user',
                useredit: '/user/edit',
                usereditlogo: '/user/editlogo',
                userediturl: '/user/editurl',
                usereditjob: '/user/editjob',
                thread: '/thread',
                threadnew: '/thread/new',
                threadedit: '/thread/edit',
                threadpreview: '/thread/preview',
                threadmydraft: '/thread/mydraft',
                threadmylist: '/thread/mylist',
                threadmyanswer: '/thread/myanswer',
                threadcreatecomment: '/thread/createcomment',
                threadremovecomment: '/thread/removecomment'
            }
        }
    },

    string: {
        ENT_KEY: '\r\n'
    },

    recaptcha: {
        PUBLIC_KEY: local.recaptcha.PUBLIC_KEY,
        PRIVATE_KEY: local.recaptcha.PRIVATE_KEY
    },
    cookie_opts: {
        path: '/',
        domain: '.osser.jp',
        secure: false,
        httpOnly: true
    },
};

//-------------------------------//
// dev-evn-set start
//-------------------------------//
//console.log('[gconfig] NODE_ENV=' + process.env.NODE_ENV);
if (process.env.NODE_ENV != 'production') {
    var mongodbip = '192.168.11.100';
    config.db.osser = 'mongodb://' + mongodbip + '/osser';
    config.db.sess_account = 'mongodb://' + mongodbip + '/sess/account';
    config.db.sess_nodejs = 'mongodb://' + mongodbip + '/sess/nodejs';

    var serverip = '192.168.11.50';
    config.url.api = 'http://' + serverip + ':8080';
    config.url.account = '//' + serverip + ':8081';
    config.url.resource = '//' + serverip + ':8082';
    config.url.nodejs = '//' + serverip + ':8083';
    config.url.redirect = '//' + serverip + ':8084';
    config.url.osser = '//' + serverip + ':8085';
    config.url.book = '//' + serverip + ':8086';
    config.url.tools = '//' + serverip + ':8087';
    config.url.sample = '//' + serverip + ':8088';

    config.cookie_opts.secure = false;
    config.cookie_opts.domain = serverip;
}
//-------------------------------//
// dev-evn-set end
//-------------------------------//

exports.config = config;