var gconfig = require('./gconfig').config;
var local = require('./local').config;
var gfunc = require('./gfunc');

var urls = {
    // amazon-category
    'nodejs': local.amazon.nodejs,
    'mongodb': local.amazon.mongodb,
    'git': local.amazon.git,

    // amazon-book
    'nodejs_in_action': local.amazon.book.nodejs_in_action,

    // inner link
    'mxWmuo4kbuuo0K': 'https://ja.gravatar.com/',
    'jxa1Kgbpd6hmwE': 'http://redis.io/',
    'vKs2pvcviaHr3q': 'http://mongoosejs.com/',
    'jzWiz2dfjqwuQ8': 'http://www.mongodb.org/',
    'oxnk4aPj4Nrwtf': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'Udg7azudwAar4c': 'https://www.npmjs.org/',
    'Bgjlfl8pptX0lg': gconfig.url.nodejs + gconfig.site.nodejs.route.helpmarkdown,
    'gn6QjrsDjms2ch': 'http://nodejs.jp/nodejs.org_ja/',
    'st2dSckc2zgzUm': 'http://nodejs.jp/',
    't9qfCnyaH1vlcs': 'http://nodejs.jp/nodejs.org_ja/api/',
    'dbkg2VmneocH6q': 'http://nodejs.org/',
    'nodejs_jobs': 'http://jobs.nodejs.org/',
};

exports.geturl = function (s) {
    return urls[s];
};

exports.addhttp = function (url) {
    if (gfunc.startsWith('http:'))
        return url;
    else
        return 'http:' + url;
};

exports.addhttps = function (url) {
    if (gfunc.startsWith('https:'))
        return url;
    else
        return 'https:' + url;
};