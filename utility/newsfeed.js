#! /usr/bin/env node

var async = require('async');
//var common = require('../common/');
var gapi = require('../common/gapi');

var program = require('commander');

program
    .version('0.1.0')
    .option('-a, --add', 'NewsFeed追加')
    .option('-r, --remove', 'NewsFeed削除')
    .option('-s, --search', 'NewsFeed検索')
    .option('-u, --update', 'NewsFeed更新')
    .option('-t, --title [title]', 'タイトル')
    .option('-l, --link [link]', 'RSSリンク')
    .option('-d, --desc [desc]', 'RSS説明')
    .option('-i, --id [id]', 'RSS-id');

program.on('--help', function () {
    console.log('======================');
    console.log('追加例：');
    console.log('./newsfeed.js -a -t "SourceForge全記事" -l "http://sourceforge.jp/magazine/rss"');
    console.log();
    console.log('削除例：');
    console.log('./newsfeed.js -d -i "534f56cd3009017609da2ac8"');
    console.log();
    console.log('検索例：');
    console.log('./newsfeed.js -s');
    console.log();
    console.log('更新例：');
    console.log('./newsfeed.js -u -i 534f5b783009017609da2aca -t "new-title" -d "new-desc" -l "http://new-link"');
    console.log('======================');
});

program.parse(process.argv);

if (program.add) {
    console.log('NewsFeed追加');
    if (program.title && program.link) {
        gapi.newsfeed.create({
            title: program.title,
            link: program.link
        }, function (err, res, body) {
            console.log(body.result);
            if (body.err) console.error(body.err);
        });
    } else {
        program.help();
    }
} else
if (program.remove) {
    console.log('NewsFeed削除');
    if (program.id) {
        gapi.newsfeed.destory(program.id, function (err, res, body) {
            console.log(body.result);
            if (body.err) console.error(body.err);
        });
    } else {
        program.help();
    }
} else
if (program.update) {
    console.log('NewsFeed更新');
    if (program.id) {
        gapi.newsfeed.update(program.id, {
            title: program.title,
            link: program.link,
            desc: program.desc
        }, function (err, res, body) {
            console.log(body.result);
            if (body.err) console.error(body.err);
        });
    } else {
        program.help();
    }
} else {
    console.log('NewsFeed検索');
    gapi.newsfeed.search({
        status: '1'
    }, function (err, res, body) {
        console.log(body.result);
        if (body.err) console.error(body.err);
        else {
            console.log('【' + body.docs.length + '件見つかりました】');
            async.forEachSeries(body.docs, function (item, done) {
                console.log(item._id, item.title, item.link);
                done();
            }, function (err) {
                if (err) console.error(err);
            });
        }
    });
}
