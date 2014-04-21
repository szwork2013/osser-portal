var config = require('./gconfig').config;
var gurl = require('./gurl');
var request = require('request');

function makejson(methodname, data) {
    return {
        uri: config.url.api + methodname,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'node-request'
        },
        json: true,
        body: JSON.stringify(data)
    };
}

exports.get = get;

function get(methodname, cb) {
    request.get(makejson(methodname, {}), cb);
}

exports.post = post;

function post(methodname, data, cb) {
    request.post(makejson(methodname, data), cb);
}

exports.delete = deleteFunc;

function deleteFunc(methodname, data, cb) {
    request.del(makejson(methodname, data), cb);
}

exports.put = put;

function put(methodname, data, cb) {
    request.put(makejson(methodname, data), cb);
}

/**
 * jsp:include
 */
exports.includeURL = includeURL;

function includeURL(url, cb) {
    request.get({
        uri: url,
        headers: {
            'User-Agent': 'node-request'
        }
    }, cb);
}

/**
 * portlet
 */
var portlet = {
    rssnews: function (cb) {
        includeURL(gurl.addhttp(config.url.nodejs + '/portlet/rssnews'), function (err, res, body) {
            if (err) console.error(err);
            cb(body);
        });
    },
};
exports.portlet = portlet;

/**
 * newsfeed
 */
var newsfeed = {
    create: function (data, cb) {
        post(config.site.api.newsfeed.create, data, cb);
    },

    destory: function (id, cb) {
        get(config.site.api.newsfeed.destory + '/' + id, cb);
    },

    search: function (searchConditions, cb) {
        post(config.site.api.newsfeed.search, searchConditions, cb);
    },

    update: function (id, data, cb) {
        post(config.site.api.newsfeed.update + '/' + id, data, cb);
    },
};
exports.newsfeed = newsfeed;

/**
 * feednews
 */
var feednews = {
    create: function (data, cb) {
        post(config.site.api.feednews.create, data, cb);
    },
    find: function (nid, cb) {
        get(config.site.api.feednews.find + '/' + nid, cb);
    },
    search: function (searchParams, cb) {
        post(config.site.api.feednews.search, searchParams, cb);
    },
};
exports.feednews = feednews;

/**
 * contentnode
 */
var contentnode = {
    update: function (id, data, cb) {
        post(config.site.api.contentnode.update + '/' + id, data, cb);
    },
};
exports.contentnode = contentnode;