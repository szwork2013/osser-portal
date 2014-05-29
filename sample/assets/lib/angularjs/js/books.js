angular.module('exampleApp').service('dataService', function () {
    return {
        getBooks: function () {
            var books = [
                {
                    title: 'AngularJSアプリケーション開発ガイド',
                    price: 2592,
                    url: 'http://r.osser.jp/book/angularjs',
                    category: 'javascript',
                    pubdate: new Date(2014, 4 - 1, 8)
                },
                {
                    title: '現場で通用する力を身につける Node.jsの教科書',
                    price: 3434,
                    url: 'http://r.osser.jp/book/nodejs-textbook',
                    category: 'nodejs',
                    pubdate: new Date(2014, 3 - 1, 25)
                },
                {
                    title: 'サーバサイドJavaScript　Node.js入門 (アスキー書籍)',
                    price: 3040,
                    url: 'http://r.osser.jp/book/serverside-javascript-nodejs',
                    category: 'javascript',
                    pubdate: new Date(2014, 2 - 1, 27)
                },
                {
                    title: 'JavaScriptで学ぶ関数型プログラミング',
                    price: 3240,
                    url: 'http://r.osser.jp/book/Functional-JavaScript-Introducing-Programming-Underscore-js-ebook',
                    category: 'javascript',
                    pubdate: new Date(2014, 1 - 1, 18)
                },
                {
                    title: 'Redis入門 インメモリKVSによる高速データ管理',
                    price: 3672,
                    url: 'http://r.osser.jp/book/redis-ruby',
                    category: 'server',
                    pubdate: new Date(2013, 12 - 1, 27)
                },
                {
                    title: 'Node.js in Action',
                    price: 4744,
                    url: 'http://r.osser.jp/book/node-in-action',
                    category: 'nodejs',
                    pubdate: new Date(2013, 11 - 1, 25)
                },
                {
                    title: 'マスタリングNginx',
                    price: 3240,
                    url: 'http://r.osser.jp/book/nginx-master',
                    category: 'server',
                    pubdate: new Date(2013, 10 - 1, 26)
                },
                {
                    title: '開眼! JavaScript ―言語仕様から学ぶJavaScriptの本質',
                    price: 2376,
                    url: 'http://r.osser.jp/book/javascript-enlightenment',
                    category: 'javascript',
                    pubdate: new Date(2013, 6 - 1, 19)
                },
                {
                    title: 'Nodeクックブック',
                    price: 3672,
                    url: 'http://r.osser.jp/book/node-cookbook',
                    category: 'nodejs',
                    pubdate: new Date(2013, 2 - 1, 23)
                }
            ];

            return books;
        }
    }
});