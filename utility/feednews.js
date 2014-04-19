#! /usr/bin/env node

var async = require('async');
var gapi = require('../common/gapi');
var program = require('commander');

program
    .version('0.1.0')
    .parse(process.argv);

gapi.newsfeed.search({
    status: '1'
}, function (err, res, body) {
    if (body.err) console.error(body.err);
    else {
        async.forEachSeries(body.docs, function (feeditem, done) {
            var FeedParser = require('feedparser');
            var request = require('request');
            var req = request(feeditem.link),
                feedparser = new FeedParser([]);
            req.on('error', function (error) {
                // リクエストエラー処理
                console.error(error);
                done();
            });
            req.on('response', function (res) {
                var stream = this;
                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
                stream.pipe(feedparser);
            });
            feedparser.on('error', function (error) {
                // 通常のエラー処理
                console.error(error);
                done();
            });
            feedparser.on('readable', function () {
                // 処理ロジック
                var stream = this,
                    meta = this.meta // **注意** metaプロパティはfeedparserインスタンスのコンテキストに常に使える
                    ,
                    item;
                while (item = stream.read()) {
                    //console.log(feeditem._id, item.title);
                    //console.log(feeditem.title);
                    var title = item.title;
                    gapi.feednews.create({
                        rsstitle: feeditem.title,
                        title: item.title,
                        summary: item.summary,
                        description: item.description,
                        link: item.link,
                        origlink: item.origlink,
                        date: item.date,
                        pubdate: item.pubdate,
                        author: item.author,
                        guid: item.guid,
                        comments: item.comments,
                        image: item.image,
                        categories: item.categories,
                        source: item.source,
                        enclosures: item.enclosures,
                        meta: item.meta
                    }, function (err, res, body) {
                        if (err) console.error(err);
                        if (body.result === 'fail') {
                            console.log(body, title);
                        }
                    });
                }
                done();
            });
        }, function (err) {
            if (err) console.error(err);
        });
    }
});