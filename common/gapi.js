var config = require('./gconfig').config;
var request = require('request');

function makejson(methodname, data) {
    return {
        uri: config.url.api + methodname,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'node-request'
        },
        json: true,
        body: JSON.stringify(data)
    };
}

exports.get = function (methodname, cb) {
    request.get(makejson(methodname, {}), cb);
};

exports.post = function (methodname, data, cb) {
    request.post(makejson(methodname, data), cb);
};

exports.delete = function (methodname, data, cb) {
    request.del(makejson(methodname, data), cb);
};

exports.put = function (methodname, data, cb) {
    request.put(makejson(methodname, data), cb);
};

/**
 * 各サービースを関数かにする予定です
 */
//exports.adduser = function (...){};