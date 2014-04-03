var should = require('should');
var common = require('../../../common');
var models = require('../../api/models');
var OssDocument = models.OssDocument;
var ContentNode = models.ContentNode;

describe('OssDocument', function () {
    it('Node.js-OSS紹介文作成しました', function (done) {
        ContentNode.remove({}, function () {
            var nodejs_node = new ContentNode({
                url: 'nodejs'
            });
            nodejs_node.save(function (err, new_nodejs_node, nodejs_node_count) {
                new_nodejs_node.url.should.equal('nodejs');
                nodejs_node_count.should.equal(1);

                OssDocument.remove({}, function () {
                    var nodejs = new OssDocument({
                        nid: new_nodejs_node,
                        name: 'Node.js',
                        nickname: 'イベント駆動型Javascriptプラットフォーム',
                        logo: common.gconfig.url.nodejs + common.gconfig.url.image.nodejs,
                        weight: 999,
                        summary: 'Node.jsは高速でスケーラブルなネットワークアプリケーションを 簡単に構築するためにChrome の JavaScript 実行環境 上に構築されたプラットフォームです。 Node.jsはイベント駆動とノンブロッキング I/O モデルを使用することにより 軽量・効率的で、分散されたデバイスにまたがるデータ集約的なリアルタイム アプリケーションに最適です。',
                        content: 'Node.jsは高速でスケーラブルなネットワークアプリケーションを 簡単に構築するためにChrome の JavaScript 実行環境 上に構築されたプラットフォームです。 Node.jsはイベント駆動とノンブロッキング I/O モデルを使用することにより 軽量・効率的で、分散されたデバイスにまたがるデータ集約的なリアルタイム アプリケーションに最適です。',
                        homepage: 'http://nodejs.org/',
                        apidocument: 'http://nodejs.org/api/',
                        download: 'http://nodejs.org/download/',
                        ispublished: true,
                        isshowtop: true,
                        isrecommended: true
                    });

                    nodejs.save(function (err, new_nodejs, new_nodejs_count) {
                        new_nodejs_count.should.equal(1);
                        new_nodejs.nid.should.equal(new_nodejs_node._id);
                        new_nodejs.name.should.equal('Node.js');
                        new_nodejs.nickname.should.equal('イベント駆動型Javascriptプラットフォーム');
                        new_nodejs.logo.should.equal(common.gconfig.url.nodejs + common.gconfig.url.image.nodejs);
                        new_nodejs.weight.should.equal(999);
                        new_nodejs.summary.should.equal(new_nodejs.content);
                        new_nodejs.homepage.should.equal('http://nodejs.org/');
                        new_nodejs.apidocument.should.equal('http://nodejs.org/api/');
                        new_nodejs.download.should.equal('http://nodejs.org/download/');
                        new_nodejs.ispublished.should.equal(true);
                        new_nodejs.isshowtop.should.equal(true);
                        new_nodejs.isrecommended.should.equal(true);
                        done();
                    });
                });

            });
        });
    });
});