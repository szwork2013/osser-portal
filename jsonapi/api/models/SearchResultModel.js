var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchResultSchema = new Schema({
    keyword: {
        type: String,
        require: true
    },
    ip: {
        type: String
    },
    upddate: {
        type: Date,
        default: Date.now
    } // 更新日
});

mongoose.model('searchresult', SearchResultSchema);