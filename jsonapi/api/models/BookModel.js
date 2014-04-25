var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
    alias: {
        type: String,
        trim: true,
        index: {
            unique: true,
            sparse: true
        }
    }, // url alias(seo)
    link: {
        type: String
    }, // amazon url
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    description: {
        type: String
    }, // 商品の説明
    language: {
        type: String
    },
    formattedPrice: {
        type: String
    },
    size: {
        type: String
    }, // 寸法
    starcount: {
        type: Number,
        default: 5
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
    }, // 更新日
    meta: {
        type: String
    } // amazon-metadata
});

mongoose.model('book', BookSchema);