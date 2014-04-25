#! /usr/bin/env node

var gapi = require('../common/gapi');
var local = require('../common/local').config;

var aws = require("./lib/aws-lib/lib/aws");

var prodAdv = aws.createProdAdvClient(local.amazon.advapi.accesskey, local.amazon.advapi.securitykey, local.amazon.advapi.mytag, {
    version: '2011-08-01'
});

prodAdv.call("ItemLookup", {
    ItemId: "4873116457",
    ResponseGroup: "Large"
}, function (err, result) {
    if (err) console.error(err);
    else {
        //console.log(JSON.stringify(result));
        console.log(result.Items.Item);

        console.log('==============================');
        console.log('link=', result.Items.Item.DetailPageURL);
        console.log('title=', result.Items.Item.ItemAttributes.Title);
        console.log('author=', result.Items.Item.ItemAttributes.Author);
        console.log('description=');
        console.log('language=', result.Items.Item.ItemAttributes.Languages.Language.Name);
        console.log('formattedPrice=', result.Items.Item.ItemAttributes.ListPrice.FormattedPrice);
        console.log('size=', result.Items.Item.ItemAttributes.Binding);
        console.log('pubdate=', result.Items.Item.ItemAttributes.PublicationDate);
        console.log('pubcompany=', result.Items.Item.ItemAttributes.Manufacturer);
        console.log('pagecount=', result.Items.Item.ItemAttributes.NumberOfPages);
        console.log('isbn10=', result.Items.Item.ItemAttributes.ISBN);
        console.log('isbn13=', result.Items.Item.ItemAttributes.EAN);
        console.log('asin=', result.Items.Item.ASIN);
        console.log('image=', result.Items.Item.LargeImage.URL);
        console.log('meta=', JSON.stringify(result.Items.Item));
    }
});