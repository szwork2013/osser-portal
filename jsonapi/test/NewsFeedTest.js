var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var NewsFeed = models.NewsFeed;

describe('NewsFeed', function () {
    before(function (done) {
        NewsFeed.remove({}, function (err) {
            done();
        });
    });

    it('Sourceforge全記事を追加した', function (done) {
        common.gapi.newsfeed.create({
            title: 'Sourceforge全記事',
            link: 'http://sourceforge.jp/magazine/rss'
        }, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('ok');
            body.newsfeed.title.should.equal('Sourceforge全記事');
            body.newsfeed.link.should.equal('http://sourceforge.jp/magazine/rss');
            body.newsfeed.status.should.equal('1');
            done();
        });
    });

    it('再度Sourceforge全記事を追加したが、失敗した', function (done) {
        common.gapi.newsfeed.create({
            title: 'Sourceforge全記事',
            link: 'http://sourceforge.jp/magazine/rss'
        }, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('fail');
            body.err.should.equal('newsfeed is aleady exist.');
            done();
        });
    });

    it('Sourceforge特集記事', function (done) {
        common.gapi.newsfeed.create({
            title: 'Sourceforge特集記事',
            link: 'http://sourceforge.jp/magazine/special/rss'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            done();
        });
    });

    it('全件検索(2件)', function (done) {
        common.gapi.newsfeed.search({}, function (err, res, body) {
            body.result.should.equal('ok');
            body.docs.length.should.equal(2);
            done();
        });
    });

    it('Sourceforge全記事を削除しました', function (done) {
        common.gapi.newsfeed.search({
            title: 'Sourceforge全記事'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            body.docs.length.should.equal(1);
            //console.log(body.docs[0]._id);
            common.gapi.newsfeed.destory(body.docs[0]._id, function (err, res, body) {
                body.result.should.equal('ok');
                body.newsfeed.status.should.equal('0');
                done();
            });
        });
    });

    it('全件検索(1件)', function (done) {
        common.gapi.newsfeed.search({
            status: '1'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            body.docs.length.should.equal(1);
            done();
        });
    });


    it('Sourceforge特集記事を更新しました', function (done) {
        common.gapi.newsfeed.search({
            status: '1'
        }, function (err, res, body) {
            body.result.should.equal('ok');
            body.docs.length.should.equal(1);
            common.gapi.newsfeed.update(body.docs[0]._id, {
                title: 'Sourceforge特集記事1',
                link: 'http://sourceforge.jp/magazine/special/rss1',
                desc: 'desc1',
                status: '0'
            }, function (err, res, body) {
                body.result.should.equal('ok');
                body.newsfeed.title.should.equal('Sourceforge特集記事1');
                body.newsfeed.link.should.equal('http://sourceforge.jp/magazine/special/rss1');
                body.newsfeed.desc.should.equal('desc1');
                body.newsfeed.status.should.equal('0');
                //console.log(body);
                done();
            });
        });

    });


});