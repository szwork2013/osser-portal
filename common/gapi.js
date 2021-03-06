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
 * thread
 */
var thread = {
    updatebookey: function (id, data, cb) {
        post(config.site.api.thread.updatebookey + '/' + id, data, cb);
    },
};

exports.thread = thread;

/**
 * portlet
 */
var portlet = {
    common: function (portletname, cb) {
        includeURL(gurl.addhttp(config.url.nodejs + '/portlet/' + portletname), function (err, res, body) {
            if (err) console.error(err);
            cb(body);
        });
    },
    rssnews: function (cb) {
        this.common('rssnews', cb);
    },
    recentthreads: function (cb) {
        this.common('recentthreads', cb);
    },
    buythebook: function (id, cb) {
        this.common('buythebook/' + id, cb);
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

/**
 * book
 */
var book = {
    create: function (data, cb) {
        post(config.site.api.book.create, data, cb);
    },
    find: function (nid, cb) {
        get(config.site.api.book.find + '/' + nid, cb);
    },
    search: function (searchParams, cb) {
        post(config.site.api.book.search, searchParams, cb);
    },
    update: function (id, data, cb) {
        post(config.site.api.book.update + '/' + id, data, cb);
    },
};
exports.book = book;

/**
 * amzbrowsernode
 */
var amzbrowsenode = {
    create: function (data, cb) {
        post(config.site.api.amzbrowsenode.create, data, cb);
    },
    find: function (nid, cb) {
        get(config.site.api.amzbrowsenode.find + '/' + nid, cb);
    },
    search: function (searchParams, cb) {
        post(config.site.api.amzbrowsenode.search, searchParams, cb);
    },
    update: function (id, data, cb) {
        post(config.site.api.amzbrowsenode.update + '/' + id, data, cb);
    },
    remove: function (nid, cb) {
        get(config.site.api.amzbrowsenode.remove + '/' + nid, cb);
    },
};
exports.amzbrowsenode = amzbrowsenode;

/**
 * amzbooknode
 */
var amzbooknode = {
    create: function (data, cb) {
        post(config.site.api.amzbooknode.create, data, cb);
    },
    find: function (nid, cb) {
        get(config.site.api.amzbooknode.find + '/' + nid, cb);
    },
    search: function (searchParams, cb) {
        post(config.site.api.amzbooknode.search, searchParams, cb);
    },
    update: function (id, data, cb) {
        post(config.site.api.amzbooknode.update + '/' + id, data, cb);
    },
    remove: function (nid, cb) {
        get(config.site.api.amzbooknode.remove + '/' + nid, cb);
    },    
};
exports.amzbooknode = amzbooknode;
