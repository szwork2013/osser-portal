#! /usr/bin/env node

var _ = require('lodash');
var async = require('async');
var program = require('commander');
var gapi = require('../common/gapi');
var local = require('../common/local').config;
var aws = require("./lib/aws-lib/lib/aws");

program
    .version('0.1.0')
    .option('-a, --add [add]', 'get and add book')
    .option('-u, --update [update]', 'update book')
    .option('-i, --id [id]', 'amazon-asin, isbn10, isbn13, ObjectId')
    .option('-l, --list', 'list books')
    .option('-s, --shorturl [shorturl]', 'shorturl(alias)')
    .option('-t, --test', 'get book for test');

program.on('--help', function () {
    console.log('======================');
    console.log('使用例：');
    console.log('./amzbook.js -t -i "4873116457"');
    console.log('./amzbook.js -a -i "4873116457"');
    console.log('./amzbook.js -a -i "4873116457" -s "nginx-master"');
    console.log('./amzbook.js -u -i "535a18843eb04c153bd92ba0"');
    console.log('./amzbook.js -l');
    console.log('======================');
});

program.parse(process.argv);

if (program.test && program.id) {
    var prodAdv = aws.createProdAdvClient(local.amazon.advapi.accesskey, local.amazon.advapi.securitykey, local.amazon.advapi.mytag, {
        version: '2011-08-01'
    });

    prodAdv.call("ItemLookup", {
        ItemId: program.id,
        ResponseGroup: "Large"
    }, function (err, result) {
        if (err) {
            done({
                result: 'fail',
                err: err
            });
        } else {
            console.log(result.Items);
//            console.log('[URL]', result.Items.Item.DetailPageURL);
//            console.log('[タイトル]', result.Items.Item.ItemAttributes.Title);
//            console.log('[価格]', getPrice(result.Items.Item.ItemAttributes.ListPrice));
//            console.log('[作者]', result.Items.Item.ItemAttributes.Author);
//            console.log('[出版社]', result.Items.Item.ItemAttributes.Manufacturer);
//            console.log('[発売日]', result.Items.Item.ItemAttributes.PublicationDate);
//            console.log('[ページ数]', result.Items.Item.ItemAttributes.NumberOfPages);
//            console.log('[言語]', getBookLang(result.Items.Item.ItemAttributes.Languages));
//            console.log('[Binding]', result.Items.Item.ItemAttributes.Binding);
//            console.log('[ISBN]', result.Items.Item.ItemAttributes.ISBN);
//            console.log('[EAN]', result.Items.Item.ItemAttributes.EAN);
//            console.log('[ASIN]', result.Items.Item.ASIN);
//            console.log('[image url]', result.Items.Item.LargeImage.URL);
        }
    });

} else if (program.add && program.id) {
    getBook({
        id: program.id,
        alias: program.shorturl
    }, function (result) {
        if (result.result === 'ok')
            console.log(result.book.title, '追加済み');
        else
            console.log(result);
    });
} else if (program.update && program.id) {
    gapi.book.update(program.id, {
        alias: 'abc9876'
    }, function (err, res, body) {
        console.log(body.book.title, body.book.alias);
    });
} else if (program.list) {
    gapi.book.search({
        status: '公開',
        //        limit: 10,
        //        skip: 0,
        sortOptions: {
            pubdate: -1
        }
    }, function (err, response, body) {
        if (body.result === 'ok') {
            async.forEach(body.books, function (bookinfo, done) {
                console.log(bookinfo.book.title, bookinfo.book.alias);
                done();
            }, function (err) {});
        } else
            console.error(body);
    });
} else {
    program.help();
}

function getBook(data, done) {
    var prodAdv = aws.createProdAdvClient(local.amazon.advapi.accesskey, local.amazon.advapi.securitykey, local.amazon.advapi.mytag, {
        version: '2011-08-01'
    });

    prodAdv.call("ItemLookup", {
        ItemId: data.id,
        ResponseGroup: "Large"
    }, function (err, result) {
        if (err) {
            done({
                result: 'fail',
                err: err
            });
        } else {
            //console.log(JSON.stringify(result));
            //console.log(result.Items.Item);
            if (result.Items.Request.Errors) {
                done({
                    result: 'fail',
                    err: result.Items.Request.Errors
                });
            } else {
                gapi.book.create({
                    alias: data.alias,
                    link: result.Items.Item.DetailPageURL,
                    title: result.Items.Item.ItemAttributes.Title,
                    author: result.Items.Item.ItemAttributes.Author,
                    //description: 'book-description-3',
                    language: getBookLang(result.Items.Item.ItemAttributes.Languages),
                    formattedPrice: getPrice(result.Items.Item.ItemAttributes.ListPrice),
                    size: result.Items.Item.ItemAttributes.Binding,
                    //starcount: '3',
                    pubdate: result.Items.Item.ItemAttributes.PublicationDate,
                    pubcompany: result.Items.Item.ItemAttributes.Manufacturer,
                    pagecount: result.Items.Item.ItemAttributes.NumberOfPages,
                    isbn10: result.Items.Item.ItemAttributes.ISBN,
                    isbn13: result.Items.Item.ItemAttributes.EAN,
                    asin: result.Items.Item.ASIN,
                    image: result.Items.Item.LargeImage.URL,
                    meta: JSON.stringify(result.Items.Item)
                }, function (err, res, body) {
                    if (err)
                        done({
                            result: 'fail',
                            err: err
                        });
                    else {
                        done(body);
                    }
                });
            }
        }
    });
}

function getPrice(ListPrice) {
    if (ListPrice) {
        return ListPrice.FormattedPrice;
    } else {
        return "オープン価格";
    }
}

function getBookLang(languages) {
    var lang = '';
    if (languages === undefined)
        lang = '日本語';
    else {
        if (_.isArray(languages.Language)) {
            async.forEachSeries(languages.Language, function (item, done) {
                if (lang) lang += ', ' + item.Name;
                else lang = item.Name;
                done();
            }, function (err) {
                if (err) console.error(err);
            });
        } else {
            lang = languages.Language.Name;
        }
    }
    return lang;
}