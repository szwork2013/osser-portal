#! /usr/bin/env node

var exec = require('child_process').exec,
    child;

var async = require('async');
var _s = require('underscore.string');
var _ = require('lodash');

var gapi = require('../../common/gapi');
var gfunc = require('../../common/gfunc');

gapi.amzbooknode.search({
    limit: 1000,
    skip: 100
}, function (err, res, body) {
    if (err) console.error(err);
    async.eachSeries(body.books, function (item, cb) {
        console.log(item.book.asin, item.book.title, gfunc.format_datestring(item.book.pubdate, true));
        child = exec('casperjs updBookCasper.js --asin=' + item.book.asin,
            function (error, stdout, stderr) {
                if (error) console.error(error);
                console.log(stdout);
                //console.error(stderr);
                cb();
            });
    }, function (err) {
        if (err) console.error(err);
    })
});