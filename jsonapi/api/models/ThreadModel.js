var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
    nid: {
        type: Schema.Types.ObjectId,
        ref: 'contentnode'
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ossid: {
        type: Schema.Types.ObjectId,
        ref: 'ossdocumenr'
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    content: {
        type: String
    },
    tags: [{
        type: String
        }], // タグ
    status: {
        type: String,
        default: '公開'
    }, // 公開;下書き;削除
    weight: {
        type: Number,
        default: 500
    }, // ウエイト
    regdate: {
        type: Date,
        default: Date.now
    }, // 登録日
    upddate: {
        type: Date,
        default: Date.now
    }, // 更新日
    visitedcount: {
        type: Number,
        default: 0
    }, // アクセス数
    bookey: {
        type: String
    } // bookkey for buy the book
});

mongoose.model('thread', ThreadSchema);