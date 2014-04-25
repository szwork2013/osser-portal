#! /usr/bin/env node

var async = require('async');
var program = require('commander');
var gapi = require('../common/gapi');
var local = require('../common/local').config;
var aws = require("./lib/aws-lib/lib/aws");

program
    .version('0.1.0')
    .option('-a, --add [add]', 'get and add book')
    .option('-i, --id [id]', 'amazon-asin, isbn10, isbn13')
    .option('-l, --list', 'list books')
    .option('-s, --shorturl [shorturl]', 'shorturl(alias)');

program.on('--help', function () {
    console.log('======================');
    console.log('使用例：');
    console.log('./amzbook.js -a -i "4873116457"');
    console.log('./amzbook.js -a -i "4873116457" -s "nginx-master"');
    console.log('======================');
});

program.parse(process.argv);

if (program.add && program.id) {
    getBook({
        id: program.id,
        alias: program.shorturl
    }, function (result) {
        if (result.result === 'ok')
            console.log(result.book.title, '追加済み');
        else
            console.log(result);
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
                console.log(bookinfo.book.title);
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
                    language: result.Items.Item.ItemAttributes.Languages === undefined ? '日本語' : result.Items.Item.ItemAttributes.Languages.Language.Name,
                    formattedPrice: result.Items.Item.ItemAttributes.ListPrice.FormattedPrice,
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

            //            console.log('==============================');
            //            console.log('link=', result.Items.Item.DetailPageURL);
            //            console.log('title=', result.Items.Item.ItemAttributes.Title);
            //            console.log('author=', result.Items.Item.ItemAttributes.Author);
            //            console.log('description=');
            //            console.log('language=', result.Items.Item.ItemAttributes.Languages.Language.Name);
            //            console.log('formattedPrice=', result.Items.Item.ItemAttributes.ListPrice.FormattedPrice);
            //            console.log('size=', result.Items.Item.ItemAttributes.Binding);
            //            console.log('pubdate=', result.Items.Item.ItemAttributes.PublicationDate);
            //            console.log('pubcompany=', result.Items.Item.ItemAttributes.Manufacturer);
            //            console.log('pagecount=', result.Items.Item.ItemAttributes.NumberOfPages);
            //            console.log('isbn10=', result.Items.Item.ItemAttributes.ISBN);
            //            console.log('isbn13=', result.Items.Item.ItemAttributes.EAN);
            //            console.log('asin=', result.Items.Item.ASIN);
            //            console.log('image=', result.Items.Item.LargeImage.URL);
            //            console.log('meta=', JSON.stringify(result.Items.Item));
        }
    });
}