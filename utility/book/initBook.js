#! /usr/bin/env node

var async = require('async');
var _s = require('underscore.string');
var _ = require('lodash');
var awsClient = require('./common').awsClient;

var gapi = require('../../common/gapi');
var program = require('commander');

gapi.amzbrowsenode.search({}, function (err, res, body) {
    console.log(body.bnodes);
});