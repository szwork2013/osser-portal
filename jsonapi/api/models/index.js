var mongoose = require('mongoose');
var gconfig = require('../../../common').gconfig;
var sails = require('sails');
var glog = require('../../../common').glog;

glog.info(sails, "Mongoose Version is " + mongoose.version);
mongoose.connect(gconfig.db.osser, function (err) {
    glog.info(sails, 'MongoDB Connect()...');
    if (err) {
        glog.error(sails, 'connect to ' + gconfig.db.osser + ', error: ' + err.message);
        process.exit(1);
    }
    glog.info(sails, 'MongoDB Connected.');
});

require('./AmzBrowseNodeModel');
require('./BookModel');
require('./CommentModel');
require('./ContentNodeModel');
require('./FeedNewsModel');
require('./LoginHistoryModel');
require('./MessageModel');
require('./NewsFeedModel');
require('./OssDocumentModel');
require('./RecoveryPasswordModel');
require('./SearchResultModel');
require('./TagModel');
require('./ThreadModel');
require('./UserModel');

exports.AmzBrowseNode = mongoose.model('amzbrowsenode');
exports.Book = mongoose.model('book');
exports.Comment = mongoose.model('comment');
exports.ContentNode = mongoose.model('contentnode');
exports.FeedNews = mongoose.model('feednews');
exports.LoginHistory = mongoose.model('loginhistory');
exports.Message = mongoose.model('message');
exports.NewsFeed = mongoose.model('newsfeed');
exports.OssDocument = mongoose.model('ossdocument');
exports.RecoveryPassword = mongoose.model('recoverypassword');
exports.SearchResult = mongoose.model('searchresult');
exports.Tag = mongoose.model('tag');
exports.Thread = mongoose.model('thread');
exports.User = mongoose.model('user');

/**
 * ObjectId判定
 */
exports.isObjectId = function (objid) {
    //return mongoose.Schema.ObjectId.isValid(objid);
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(objid);
};