#! /usr/bin/env node

var async = require('async');
var program = require('commander');
var gapi = require('../common/gapi');

program
    .version('0.1.0')
    .option('-i, --id [id]', 'amazon-asin, isbn10, isbn13')
    .option('-k, --bookey [bookey]', 'book key');

program.on('--help', function () {
    console.log('======================');
    console.log('使用例：');
    console.log('./thread.js -i "5345e2ac10562be86767d6f0" -k "nginx-master"');
    console.log('======================');
});

program.parse(process.argv);

if (program.id && program.bookey) {
    gapi.thread.updatebookey(program.id, {
        bookey: program.bookey
    }, function (err, res, body) {
        console.log(body.result);
    });
} else {
    program.help();
}