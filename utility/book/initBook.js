#! /usr/bin/env node

var async = require('async');
var _s = require('underscore.string');
var _ = require('lodash');
var awsClient = require('./common').awsClient;

var gapi = require('../../common/gapi');
var program = require('commander');

gapi.amzbrowsenode.search({
    limit: 20,
    skip: 0,
    sortOptions: {
        regdate: -1
    }
}, function (err, res, body) {
    //console.log(body.bnodes);

    /*    
    salesrank	売れている順番
    pricerank	価格: 低～高
    inverse-pricerank	価格: 高～低
    daterank	出版日: 新しい日付～古い日付
    titlerank	アルファベット順: A～Z
    -titlerank	アルファベット順: Z～A
    */

    var sortList = ['salesrank', 'pricerank', 'inverse-pricerank', 'daterank', 'titlerank', '-titlerank'];
    async.eachSeries(body.bnodes, function (item, done) {
        async.eachSeries(sortList, function (sortKey, cb) {
            setTimeout(function () {
                sortLoop(item.bnode.bnodeid, sortKey, cb);
            }, 5000);
        }, function (err) {
            if (err) console.error('1:', err);
            done();
        });
    }, function (err) {
        if (err) console.error('2:', err);
    });
});

function sortLoop(bnodeid, sortKey, cb) {
    //console.log(item.bnode.bnodeid, item.bnode.name);
    awsClient.call("ItemSearch", {
        SearchIndex: "Books",
        BrowseNode: bnodeid,
        ItemPage: 1,
        ResponseGroup: 'Small',
        Sort: sortKey
    }, function (err, result) {
        if (err) {
            console.error('3:', err);
            sortKey(bnodeid, sortKey, cb);
        } else {
            console.log(bnodeid, sortKey, result.Items.TotalPages, result.Items.TotalResults);
            var pagecount = +result.Items.TotalPages;
            if (_.isNaN(pagecount)) pagecount = 1;
            if (pagecount > 10) pagecount = 10;
            var pagelist = [];
            for (var i = 0; i < pagecount; i++) {
                pagelist[i] = i + 1;
            }
            async.eachSeries(pagelist, function (pageindex, pgcb) {
                setTimeout(function () {
                    awsClient.call("ItemSearch", {
                        SearchIndex: "Books",
                        //Keywords: "Javascript"
                        BrowseNode: bnodeid,
                        ItemPage: pageindex,
                        ResponseGroup: 'Large',
                        Sort: sortKey
                    }, function (err, result) {
                        if (err) {
                            console.error('4:', err);
                            pgcb();
                            //sortKey(bnodeid, sortKey, cb);
                        } else {
                            //console.log(result);
                            async.eachSeries(result.Items.Item, function (book, done) {
                                console.log(pageindex, sortKey, bnodeid, book.ASIN, book.ItemAttributes.Title);

                                gapi.amzbooknode.create({
                                    //alias: 'book-alias-3',
                                    link: book.DetailPageURL,
                                    title: book.ItemAttributes.Title,
                                    author: book.ItemAttributes.Author,
                                    //description: 'book-description-3',
                                    language: getBookLang(book.ItemAttributes.Languages),
                                    formattedPrice: getPrice(book.ItemAttributes.ListPrice),
                                    size: book.ItemAttributes.Binding,
                                    //starcount: '3',
                                    pubdate: book.ItemAttributes.PublicationDate,
                                    pubcompany: book.ItemAttributes.Manufacturer,
                                    pagecount: book.ItemAttributes.NumberOfPages,
                                    isbn10: book.ItemAttributes.ISBN,
                                    isbn13: book.ItemAttributes.EAN,
                                    asin: book.ASIN,
                                    image: getLargeImageURL(book.LargeImage),
                                    meta: JSON.stringify(book)
                                }, function (err, res, body) {
                                    if (err) console.error(err);
                                    if (body.result !== 'ok') console.log(body);
                                    done();
                                });
                            }, function (err) {
                                if (err) console.error('5:', err);
                                pgcb();
                            });
                        }
                    });
                }, 5000);
            }, function (err) {
                if (err) console.error('6:', err);
                cb();
            });
        }
    });
}

function getLargeImageURL(LargeImage) {
    if (LargeImage)
        return LargeImage.URL;
    else
        return "";
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