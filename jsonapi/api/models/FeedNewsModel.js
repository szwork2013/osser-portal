var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedNewsSchema = new Schema({
    nid: {
        type: Schema.Types.ObjectId,
        ref: 'contentnode'
    },
    rsstitle: {
        type: String
    },
    title: {
        type: String,
        require: true
    },
    summary: {
        type: String
    },
    description: {
        type: String
    },
    link: {
        type: String,
        require: true
    },
    origlink: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }, //更新日時
    pubdate: {
        type: Date,
        default: Date.now
    }, //登録日付
    author: {
        type: String
    },
    guid: {
        type: String
    },
    comments: {
        type: String
    },
    image: {
        type: String
    },
    categories: {
        type: String
    },
    source: {
        type: String
    },
    enclosures: {
        type: String
    },
    meta: {
        type: String
    },
    weight: {
        type: Number,
        default: 500
    },
    status: {
        type: String,
        default: '1' //(1:有効;0:無効)
    }
});

mongoose.model('feednews', FeedNewsSchema);