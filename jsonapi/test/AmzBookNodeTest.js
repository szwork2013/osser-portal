var should = require('should');
var common = require('../../common');
var models = require('../api/models');
var AmzBookNode = models.AmzBookNode;

describe('AmzBookNode', function () {
    before(function (done) {
        AmzBookNode.remove({}, function (err) {
            done();
        });
    });
    it('AmzBook1追加失敗', function (done) {
        common.gapi.amzbooknode.create({}, function (err, res, body) {
            //console.log(body);
            body.result.should.equal('fail');
            body.err.title.msg.should.equal('タイトルを入力してください。');
            done();
        });
    });
    it('AmzBook2を作成しました', function (done) {
        common.gapi.amzbooknode.create({
            title: 'book-title-2'
        }, function (err, res, body) {
            if (err) console.error(err);
            else {
                body.result.should.equal('ok');
                body.book.title.should.equal('book-title-2');
                //console.log(body);
                common.gapi.amzbooknode.find(body.book._id, function (err, res, body) {
                    body.result.should.equal('ok');
                    body.book.title.should.equal('book-title-2');
                    done();
                });
            }
        });
    });
    it('AmzBook3を作成しました', function (done) {
        common.gapi.amzbooknode.create({
            alias: 'book-alias-3',
            link: 'book-link-3',
            title: 'book-title-3',
            author: 'book-author-3',
            description: 'book-description-3',
            language: 'book-language-3',
            formattedPrice: '￥ 3,240',
            size: 'book-size-3',
            starcount: '3',
            //pubdate: 'book-pubdate-3',
            pubcompany: 'book-pubcompany-3',
            pagecount: 'book-pagecount-3',
            isbn10: 'book-isbn10-3',
            isbn13: 'book-isbn13-3',
            asin: 'book-asin-3',
            image: 'book-image-3',
            status: 'book-status-3',
            meta: 'book-meta-3'
        }, function (err, res, body) {
            if (err) console.error(err);
            else {
                body.result.should.equal('ok');
                body.book.alias.should.equal('book-alias-3');
                body.book.link.should.equal('book-link-3');
                body.book.title.should.equal('book-title-3');
                body.book.author.should.equal('book-author-3');
                body.book.description.should.equal('book-description-3');
                body.book.language.should.equal('book-language-3');
                body.book.formattedPrice.should.equal('￥ 3,240');
                body.book.size.should.equal('book-size-3');
                body.book.starcount.should.equal(3);
                //body.book.pubdate.should.equal('book-pubdate-3');
                body.book.pubcompany.should.equal('book-pubcompany-3');
                body.book.pagecount.should.equal('book-pagecount-3');
                body.book.isbn10.should.equal('book-isbn10-3');
                body.book.isbn13.should.equal('book-isbn13-3');
                body.book.asin.should.equal('book-asin-3');
                body.book.image.should.equal('book-image-3');
                body.book.status.should.equal('book-status-3');
                body.book.meta.should.equal('book-meta-3');
                //body.book.regdate.should.equal('book-regdate-3');
                //console.log(body);
                common.gapi.amzbooknode.find(body.book._id, function (err, res, body) {
                    body.result.should.equal('ok');
                    body.book.alias.should.equal('book-alias-3');
                    body.book.link.should.equal('book-link-3');
                    body.book.title.should.equal('book-title-3');
                    body.book.author.should.equal('book-author-3');
                    body.book.description.should.equal('book-description-3');
                    body.book.language.should.equal('book-language-3');
                    body.book.formattedPrice.should.equal('￥ 3,240');
                    body.book.size.should.equal('book-size-3');
                    body.book.starcount.should.equal(3);
                    //body.book.pubdate.should.equal('book-pubdate-3');
                    body.book.pubcompany.should.equal('book-pubcompany-3');
                    body.book.pagecount.should.equal('book-pagecount-3');
                    body.book.isbn10.should.equal('book-isbn10-3');
                    body.book.isbn13.should.equal('book-isbn13-3');
                    body.book.asin.should.equal('book-asin-3');
                    body.book.image.should.equal('book-image-3');
                    body.book.status.should.equal('book-status-3');
                    body.book.meta.should.equal('book-meta-3');
                    common.gapi.amzbooknode.update(body.book._id, {
                        alias: 'book-alias-3-new',
                        link: 'book-link-3-new',
                        title: 'book-title-3-new',
                        author: 'book-author-3-new',
                        description: 'book-description-3-new',
                        language: 'book-language-3-new',
                        formattedPrice: '￥ 3,999',
                        size: 'book-size-3-new',
                        starcount: '30',
                        //pubdate: 'book-pubdate-3',
                        pubcompany: 'book-pubcompany-3-new',
                        pagecount: 'book-pagecount-3-new',
                        isbn10: 'book-isbn10-3-new',
                        isbn13: 'book-isbn13-3-new',
                        asin: 'book-asin-3-new',
                        image: 'book-image-3-new',
                        status: 'book-status-3-new',
                        meta: 'book-meta-3-new'
                    }, function (err, res, body) {
                        body.result.should.equal('ok');
                        body.book.alias.should.equal('book-alias-3-new');
                        body.book.link.should.equal('book-link-3-new');
                        body.book.title.should.equal('book-title-3-new');
                        body.book.author.should.equal('book-author-3-new');
                        body.book.description.should.equal('book-description-3-new');
                        body.book.language.should.equal('book-language-3-new');
                        body.book.formattedPrice.should.equal('￥ 3,999');
                        body.book.size.should.equal('book-size-3-new');
                        body.book.starcount.should.equal(30);
                        //body.book.pubdate.should.equal('book-pubdate-3');
                        body.book.pubcompany.should.equal('book-pubcompany-3-new');
                        body.book.pagecount.should.equal('book-pagecount-3-new');
                        body.book.isbn10.should.equal('book-isbn10-3-new');
                        body.book.isbn13.should.equal('book-isbn13-3-new');
                        body.book.asin.should.equal('book-asin-3-new');
                        body.book.image.should.equal('book-image-3-new');
                        body.book.status.should.equal('book-status-3-new');
                        body.book.meta.should.equal('book-meta-3-new');
                        //console.log(body);
                        done();
                    });
                });
            }
        });
    });

});