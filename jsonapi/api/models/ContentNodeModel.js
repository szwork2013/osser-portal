var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContentNodeSchema = new Schema({
    url: {
        type: String,
        require: true
    }
});

mongoose.model('contentnode', ContentNodeSchema);