var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    language: {
        type: String
    },
    size: {
        type: String
    }, // 寸法
    starcount: {
        type: Number
    }, // おすすめ度
    pubdate: {
        type: Date,
        default: Date.now
    }, // 発売日
    pubcompany: {
        type: String
    }, // 出版社
    pagecount: {
        type: String
    }, // ページ数
    isbn10: {
        type: String
    },
    isbn13: {
        type: String
    },
    asin: {
        type: String
    },
    image: {
        type: String
    }, // image path
    status: {
        type: String,
        default: '公開'
    }, // 公開;削除
    regdate: {
        type: Date,
        default: Date.now
    } // 更新日
});

mongoose.model('book', BookSchema);