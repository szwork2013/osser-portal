#! /usr/bin/env node

var async = require('async');
var _s = require('underscore.string');
var _ = require('lodash');
var awsClient = require('./common').awsClient;

var gapi = require('../../common/gapi');
var program = require('commander');


program
    .version('0.1.0')
    .option('-a, --add', 'get browsernode from amazon')
    .option('-u, --update', 'update browsernode from amazon')
    .option('-i, --bid [bid]', 'browse node id')
    .option('-t, --test', 'get book for test');

program.on('--help', function () {
    console.log('======================');
    console.log('使用例：');
    console.log('./initBNode.js -t -i 466298');
    console.log('./initBNode.js -a -i 466298');
    console.log('./initBNode.js -u -i 466298');
    console.log('======================');
});

program.parse(process.argv);

var spaceCount = 4;

if (program.add && program.bid) {
    //console.log(program.add, program.bid);
    //mainLoop("466298", 0);
    mainLoop(program.bid, 0);
} else if (program.update && program.bid) {
    //console.log(program.update, program.bid);

} else {
    program.help();
}


function mainLoop(bNodeId, level, done) {
    awsClient.call("BrowseNodeLookup", {
        BrowseNodeId: bNodeId
    }, function (err, result) {
        if (err) {
            console.error('1:', err);
            setTimeout(function () {
                mainLoop(bNodeId, level, done);
            }, 5000);
        } else {
            var bNode = result.BrowseNodes.BrowseNode;
            console.log(_s.lpad("", level * spaceCount, ""), bNode.BrowseNodeId, bNode.Name);
            if (bNode.Children) {
                var childnodes = [];
                async.mapSeries(bNode.Children.BrowseNode, function (item, cb) {
                    cb(null, item.BrowseNodeId);
                }, function (err, results) {
                    //console.log(results);
                    if (program.test) {
                        // test modeでDB挿入しない
                        async.forEachSeries(bNode.Children.BrowseNode, function (item, done) {
                            setTimeout(function () {
                                mainLoop(item.BrowseNodeId, level + 1, done);
                            }, 5000);
                        }, function (err) {
                            if (err) console.error('2:', err);
                            if (done != null)
                                done();
                        });
                    } else {
                        gapi.amzbrowsenode.create({
                            bnodeid: bNode.BrowseNodeId,
                            name: bNode.Name,
                            children: results
                        }, function (err, res, body) {
                            if (err) console.log(err);
                            if (body.result !== 'ok') console.log(body);
                            async.forEachSeries(bNode.Children.BrowseNode, function (item, done) {
                                setTimeout(function () {
                                    mainLoop(item.BrowseNodeId, level + 1, done);
                                }, 5000);
                            }, function (err) {
                                if (err) console.error('3:', err);
                                if (done != null)
                                    done();
                            });
                        });
                    }
                });
            } else {
                if (program.test) {
                    // test modeでDB挿入しない
                    if (done != null)
                        done();
                } else
                    gapi.amzbrowsenode.create({
                        bnodeid: bNode.BrowseNodeId,
                        name: bNode.Name
                    }, function (err, res, body) {
                        if (err) console.log(err);
                        if (body.result !== 'ok') console.log(body);
                        if (done != null)
                            done();
                    });
            }
        }
    });
}