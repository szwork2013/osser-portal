var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsFeedSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    desc: {
        type: String
    },
    link: {
        type: String,
        require: true
    },
    regdate: {
        type: Date,
        default: Date.now
    }, //登録日付
    status: {
        type: String,
        default: '1' //(1:有効;0:無効)
    }
});

mongoose.model('newsfeed', NewsFeedSchema);