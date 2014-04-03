var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {
        type: String,
        require: true
    }, // 例：Node.js入門
    desc: {
        type: String
    },
    url: {
        type: String
    }, // 例：nodejs-lesson
    status: {
        type: String,
        default: '公開'
    }, // 公開;削除
    weight: {
        type: Number,
        default: 500
    },
    upddate: {
        type: Date,
        default: Date.now
    } // 更新日
});

mongoose.model('tag', TagSchema);