var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var AmzBrowseNode = models.AmzBrowseNode;

describe('AmzBrowseNode', function () {
    before(function (done) {
        AmzBrowseNode.remove({}, function (err) {
            done();
        });
    });
    it('bnode1を追加してみて、失敗しました', function (done) {
        common.gapi.amzbrowsenode.create({}, function (err, res, body) {
            if (err) console.error(err);
            //console.log(body);
            body.result.should.equal('fail');
            body.err.bnodeid.msg.should.equal('bnodeid is null');
            body.err.name.msg.should.equal('name is null');
            done();
        });
    });
    it('bnode1データを用意して、追加しました', function (done) {
        common.gapi.amzbrowsenode.create({
            bnodeid: '1111111',
            name: 'IT'
        }, function (err, res, body) {
            if (err) console.error(err);
            //console.log(body);
            body.result.should.equal('ok');
            body.bnode.bnodeid.should.equal('1111111');
            body.bnode.name.should.equal('IT');
            body.bnode.status.should.equal('公開');
            common.gapi.amzbrowsenode.find(body.bnode.bnodeid, function (err, res, body) {
                body.result.should.equal('ok');
                body.bnode.bnodeid.should.equal('1111111');
                body.bnode.name.should.equal('IT');
                body.bnode.status.should.equal('公開');
                common.gapi.amzbrowsenode.remove(body.bnode.bnodeid, function (err, res, body) {
                    //console.log(body);
                    body.result.should.equal('ok');
                    body.bnode.bnodeid.should.equal('1111111');
                    body.bnode.name.should.equal('IT');
                    body.bnode.status.should.equal('削除');
                    common.gapi.amzbrowsenode.update(body.bnode.bnodeid, {
                        name: 'ITIT'
                    }, function (err, res, body) {
                        //console.log(body);
                        body.result.should.equal('ok');
                        body.bnode.name.should.equal('ITIT');
                        done();
                    });
                });
            });
        });
    })
    it('bnode2データを追加しました', function (done) {
        common.gapi.amzbrowsenode.create({
            bnodeid: '22222222',
            name: 'bnode2'
        }, function (err, res, body) {
            if (err) console.error(err);
            body.result.should.equal('ok');
            done();
        });
    });
    it('bnode3データを追加しました', function (done) {
        common.gapi.amzbrowsenode.create({
            bnodeid: '33333333',
            name: 'bnode3'
        }, function (err, res, body) {
            if (err) console.error(err);
            body.result.should.equal('ok');
            done();
        });
    });
    it('search', function (done) {
        common.gapi.amzbrowsenode.search({
            limit: 1,
            skip: 0,
            sortOptions: {
                name: 1
            }
        }, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.count.should.equal(3);
            done();
        });
    });
});