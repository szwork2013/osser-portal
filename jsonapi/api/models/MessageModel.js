var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var message_tree = require('../libs/message-tree');

var MessageSchema = new Schema({
    fid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    tid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isread: {
        type: Boolean,
        default: false
    }, // 既読フラグ：true:既読;false:未読
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: '公開'
    }, // 公開;削除;個人
    upddate: {
        type: Date,
        default: Date.now
    } // 更新日
});

MessageSchema.plugin(message_tree);

mongoose.model('message', MessageSchema);