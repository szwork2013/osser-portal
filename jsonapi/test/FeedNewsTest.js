var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var FeedNews = models.FeedNews;

describe('FeedNews', function () {
    before(function (done) {
        FeedNews.remove({}, function (err) {
            done();
        });
    });

    it('news追加エラーチェックを行いました', function (done) {
        common.gapi.feednews.create({}, function (err, res, body) {
            if (err) console.error(err);
            body.result.should.equal('fail');
            done();
        });
    });
    it('news1を追加しました', function (done) {
        common.gapi.feednews.create({
            title: 'news1',
            link: 'http://news1',
            guid: 'http://news1',
        }, function (err, res, body) {
            if (err) console.error(err);
            //console.log(body);
            body.result.should.equal('ok');
            body.news.title.should.equal('news1');
            body.news.link.should.equal('http://news1');
            done();
        });
    });

    it('news2を追加しました', function (done) {
        common.gapi.feednews.create({
            title: 'news2',
            summary: 'summary2',
            description: 'description2',
            link: 'http://news2',
            origlink: 'origlink2',
            date: '2014-04-17T05:50:39.686Z',
            pubdate: '2014-04-18T05:50:39.686Z',
            author: 'author2',
            guid: 'http://guid2',
            comments: 'comments2',
            image: 'image2',
            categories: 'categories2',
            source: 'source2',
            enclosures: 'enclosures2',
            meta: 'meta2'
        }, function (err, res, body) {
            if (err) console.error(err);
            //console.log(body);
            body.result.should.equal('ok');
            body.news.title.should.equal('news2');
            body.news.summary.should.equal('summary2');
            body.news.description.should.equal('description2');
            body.news.link.should.equal('http://news2');
            body.news.origlink.should.equal('origlink2');
            body.news.date.should.equal('2014-04-17T05:50:39.686Z');
            body.news.pubdate.should.equal('2014-04-18T05:50:39.686Z');
            body.news.author.should.equal('author2');
            body.news.guid.should.equal('http://guid2');
            body.news.comments.should.equal('comments2');
            body.news.image.should.equal('image2');
            body.news.categories.should.equal('categories2');
            body.news.source.should.equal('source2');
            body.news.enclosures.should.equal('enclosures2');
            body.news.meta.should.equal('meta2');
            done();
        });
    });

    it('searchで検索しました', function (done) {
        common.gapi.feednews.search({}, function (err, res, body) {
            if (err) console.error(err);
            console.log(body.results[0].news);
            done();
        });
    });
});