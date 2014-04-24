var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
<<<<<<< HEAD
    alias: {
        type: String
    }, // url alias(seo)
    link: {
        type: String
    }, // amazon url
=======
>>>>>>> 48687fc36c17c1943a697465dce9df12a465187a
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
<<<<<<< HEAD
    description: {
        type: String
    }, // 商品の説明
=======
>>>>>>> 48687fc36c17c1943a697465dce9df12a465187a
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