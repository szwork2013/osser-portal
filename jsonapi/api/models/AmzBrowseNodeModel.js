// Amazon Browser Node
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AmzBrowseNodeSchema = new Schema({
    bnodeid: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    children: {
        type: [String]
    },
    regdate: {
        type: Date,
        default: Date.now
    }, // 登録日
    upddate: {
        type: Date,
        default: Date.now
    }, // 更新日
    status: {
        type: String,
        default: '公開'
    } // 公開;削除
});

mongoose.model('amzbrowsenode', AmzBrowseNodeSchema);