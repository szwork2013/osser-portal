//var aws = require("aws-lib");
//var local = require('../local').config;
var local = require('../../common/local').config;
var aws = require("../lib/aws-lib/lib/aws");

var awsClient = aws.createProdAdvClient(local.amazon.advapi.accesskey, local.amazon.advapi.securitykey, local.amazon.advapi.mytag, {
    version: '2011-08-01',
    region: 'JP'
});

exports.awsClient = awsClient;