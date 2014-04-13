var should = require('should');
var request = require('request');
var async = require('async');
var common = require('../common');
var local = require('../common/local').config;

//console.log(local.amazon);

var urlist_200 = [
    common.gconfig.url.nodejs,
    common.gconfig.url.nodejs + '/sitemap.xml',
    common.gconfig.url.nodejs + '/robots.txt',
    common.gconfig.url.nodejs + '/images/osser.png',
    common.gconfig.url.nodejs + '/nodejs',
    common.gconfig.url.nodejs + '/help/markdown',
    common.gconfig.url.nodejs + '/search',
    common.gconfig.url.nodejs + '/user',
    common.gconfig.url.nodejs + '/user/edit',
    common.gconfig.url.nodejs + '/user/editlogo',
    common.gconfig.url.nodejs + '/user/editurl',
    common.gconfig.url.nodejs + '/user/editjob',
    common.gconfig.url.nodejs + '/thread',
    common.gconfig.url.nodejs + '/thread/new',
    common.gconfig.url.nodejs + '/thread/edit',
    common.gconfig.url.nodejs + '/thread/preview',
    common.gconfig.url.nodejs + '/thread/mydraft',
    common.gconfig.url.nodejs + '/thread/mylist',
    common.gconfig.url.nodejs + '/thread/myanswer',
    common.gconfig.url.nodejs + '/thread/createcomment',
    common.gconfig.url.nodejs + '/thread/removecomment',

    common.gconfig.url.account,
    common.gconfig.url.account + '/security/login',
    common.gconfig.url.account + '/security/logout',
    common.gconfig.url.account + '/security/signup',
 //    common.gconfig.url.account + '/security/emailauth',
    common.gconfig.url.account + '/security/recovery',
    common.gconfig.url.account + '/security/password',
 //    common.gconfig.url.account + '/security/passwordauth',

    common.gconfig.url.api,
    common.gconfig.url.api + '/user/create',
    common.gconfig.url.api + '/user/update',
    common.gconfig.url.api + '/user/find',
    common.gconfig.url.api + '/user/findByEmail',
    common.gconfig.url.api + '/user/fingByMyurl',
    common.gconfig.url.api + '/user/addExperience',
    common.gconfig.url.api + '/security/login',
    common.gconfig.url.api + '/security/ssologin',
    common.gconfig.url.api + '/thread/create',
    common.gconfig.url.api + '/thread/find',
    common.gconfig.url.api + '/thread/findBynid',
    common.gconfig.url.api + '/thread/update',
    common.gconfig.url.api + '/thread/destory',
    common.gconfig.url.api + '/thread/search',
    common.gconfig.url.api + '/thread/searchFromComment',
    common.gconfig.url.api + '/thread/count',
    common.gconfig.url.api + '/comment/create',
    common.gconfig.url.api + '/comment/find',
    common.gconfig.url.api + '/comment/destory',
    common.gconfig.url.api + '/comment/search',
    common.gconfig.url.api + '/message/create',
    common.gconfig.url.api + '/message/find',
    common.gconfig.url.api + '/message/destory',
    common.gconfig.url.api + '/message/search',
    common.gconfig.url.api + '/tag/create',
    common.gconfig.url.api + '/tag/find',
    common.gconfig.url.api + '/tag/update',
    common.gconfig.url.api + '/tag/destory',
    common.gconfig.url.api + '/tag/search',
    common.gconfig.url.api + '/searchresult/create',
    common.gconfig.url.api + '/searchresult/search',

    common.gconfig.url.osser,
    common.gconfig.url.oldosser,

    local.amazon.nodejs,
    local.amazon.mongodb,
    local.amazon.git,

    local.amazon.book.node_cookbook,
    local.amazon.book.nodejs_in_action,
    local.amazon.book.kaigan_javascript,
];

/**
 * http status code 200 test
 */
async.eachSeries(urlist_200, function (item, callback) {
    var url = item;
    if (!startsWith(item, 'http:')) url = 'http:' + url;
    web_access_test(url, 200, function () {
        callback();
    });
}, function (err) {
    if (err) console.error(err);
    else console.log('----- web test ok -----');
});

function web_access_test(url, statusCode, cb) {
    request(url, function (error, response, body) {
        response.statusCode.should.equal(statusCode);
        //console.log(url + ' ' + response.headers['content-length'] + ' ' + statusCode + ' ok');
        console.log(url + ' ' + statusCode + ' ok');
        cb();
    })
}

function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
};