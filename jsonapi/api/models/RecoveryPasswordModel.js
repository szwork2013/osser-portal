var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecoveryPasswordSchema = new Schema({
    uid: {
        type: String,
        require: true
    },
    valid: {
        // true:リセット中;false:リセット終了
        type: Boolean,
        default: true
    },
    createdate: {
        type: Date,
        default: Date.now,
        // TTL:expireAfterSeconds=30分
        expires: 60 * 30
    }
});

mongoose.model('recoverypassword', RecoveryPasswordSchema);