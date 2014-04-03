var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var comment_tree = require('mongoose-tree');
var comment_tree = require('../libs/comment-tree');

var CommentSchema = new Schema({
    nid: {
        type: Schema.Types.ObjectId,
        ref: 'contentnode',
        required: true
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: '公開'
    }, // 公開;削除
    upddate: {
        type: Date,
        default: Date.now
    } // 更新日
});

CommentSchema.plugin(comment_tree);

mongoose.model('comment', CommentSchema);