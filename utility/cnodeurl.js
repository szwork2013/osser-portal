#! /usr/bin/env node

var gapi = require('../common/gapi');

var program = require('commander');


program
    .version('0.1.0')
    .option('-i, --id [id]', 'cnode-id')
    .option('-u, --url [url]', 'コンテンツノードurl');

program.on('--help', function () {
    console.log('======================');
    console.log('使用例：');
    console.log('./cnodeurl.js -i "534f56cd3009017609da2ac8" -u "node-postgres"');
    console.log('======================');
});

program.parse(process.argv);

if (program.id && program.url) {
    gapi.contentnode.update(program.id, {
        url: program.url
    }, function (err, res, body) {
        console.log(body.result);
        if (body.result === 'fail') console.error(body);
    });
} else {
    program.help();
}