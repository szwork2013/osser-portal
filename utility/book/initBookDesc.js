#! /usr/bin/env node

var async = require('async');
var _s = require('underscore.string');
var _ = require('lodash');

var gapi = require('../../common/gapi');

gapi.amzbooknode.search({
    limit: 10,
    skip: 0
}, function (err, res, body) {
    if (err) console.error(err);
    async.each(body.books, function (item, cb) {
        console.log(item.book.asin, item.book.title);
        cb();
    }, function (err) {
        if (err) console.error(err);
    })
});