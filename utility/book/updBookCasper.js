/**
 * 仕様：
 * 引数：
 * --asin:アマゾンASIN
 * --test:テストモード
 */
//var _s = require('underscore.string');
//var _ = require('lodash');
var casper = require('casper').create({
    pageSetting: {
        loadImages: false,
        loadPugins: false
    }
});
var xpath = require('casper').selectXPath;

var options = casper.cli.options;

if (options.asin) {
    var url = 'http://www.amazon.co.jp/dp/' + options.asin;
    //console.log(url);
    casper.start(url, function () {
        //this.echo(this.getTitle());
        var desc = casper.getHTML(xpath('//*[@id="productDescription"]/div'));
        //var desc = casper.fetchText(xpath('//*[@id="productDescription"]/div'));

        //desc = _s.trim(desc);
        desc = desc.trim();
        if (options.test)
            console.log(desc, '---get ok---');
        // add/update
        casper.open('http://127.0.0.1:8080/book/search', {
            headers: {
                'Accept': 'application/json'
            },
            method: 'post',
            data: {
                asin: options.asin
            }
        });
        casper.then(function () {
            var body = JSON.parse(this.getPageContent());
            if (body.result === 'ok') {
                if (body.books.length > 0) {
                    var book = body.books[0].book;
                    if (options.test)
                        console.log(book._id, '---book id get ok---');
                    else {
                        // 更新処理
                        casper.open('http://127.0.0.1:8080/amzbooknode/update/' + book._id, {
                            headers: {
                                'Accept': 'application/json'
                            },
                            method: 'post',
                            data: {
                                description: desc
                            }
                        });
                        casper.then(function () {
                            var body = JSON.parse(this.getPageContent());
                            if (body.result ==='ok')
                                console.log('更新済み');
                            else
                                console.error(body);
                        });
                    }
                }
            }
        });

    });

    casper.run();
} else {
    console.log('使用例：');
    console.log('casperjs updBookCasper.js --asin=4873116457');
    console.log('casperjs updBookCasper.js --asin=4873116457 --test');
    casper.exit();
}