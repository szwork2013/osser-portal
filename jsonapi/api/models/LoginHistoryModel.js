var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginHistorySchema = new Schema({
    email: {
        type: String,
        require: true
    },
    ip: {
        type: String
    },
    result: {
        // true:ログイン成功;false:ログイン失敗
        type: Boolean
    },
    useragent: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('loginhistory', LoginHistorySchema);