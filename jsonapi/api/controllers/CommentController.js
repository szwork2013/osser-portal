/**
 * CommentController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var validator = require('validator');
var async = require('async');
var common = require('../../../common');
var models = require('../models');
var User = models.User;
var Comment = models.Comment;
var ContentNode = models.ContentNode;
var Thread = models.Thread;

module.exports = {


    /**
     * Action blueprints:
     *    `/comment/index`
     *    `/comment`
     */
    index: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'comment'
        });
    },


    /**
     * Action blueprints:
     *    `/comment/create`
     */
    create: function (req, res) {
        //common.glog.info(sails, JSON.stringify(req.body));
        req.checkBody('uid', common.gmsg.mustinput_uid).notEmpty();
        req.checkBody('nid', common.gmsg.mustinput_nid).notEmpty();
        req.checkBody('content', common.gmsg.mustinput_content).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        ContentNode.findOne({
            _id: req.body.nid
        }, function (err, contentnode) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            if (contentnode) {
                // 親コメントID（ほかの人のコメントへのコメントする場合）
                var comment_pid = req.body.pid;
                if (comment_pid) {
                    Comment.findOne({
                        _id: comment_pid
                    }, function (err, pcomment) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        if (pcomment) {
                            var comment = new Comment(getCreateJSON(req));
                            comment.parent = pcomment;
                            comment.save(function (err, newcomment) {
                                if (err) {
                                    return res.json({
                                        result: 'fail',
                                        err: err
                                    });
                                } else {
                                    updthreadupddate(req.body.nid, function (err) {
                                        if (err) common.glog.error(sails, err);
                                        return res.json({
                                            result: 'ok',
                                            id: newcomment._id
                                        });
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        }
                    });
                } else {
                    var comment = new Comment(getCreateJSON(req));
                    comment.save(function (err, newcomment) {
                        if (err) {
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        } else {
                            updthreadupddate(req.body.nid, function (err) {
                                if (err) common.glog.error(sails, err);
                                return res.json({
                                    result: 'ok',
                                    id: newcomment._id
                                });
                            });
                        }
                    });
                }
            } else {
                return res.json({
                    result: 'fail',
                    err: 'コンテンツノードは存在しません。'
                });
            }
        });
    },


    /**
     * Action blueprints:
     *    `/comment/find`
     */
    find: function (req, res) {

        var id = req.param('id');

        Comment.findOne({
            _id: id
        }, function (err, comment) {
            if (err)
                return res.json({
                    result: 'ok',
                    err: err
                });
            else {
                return res.json({
                    result: 'ok',
                    comment: comment
                });
            }
        });
    },


    /**
     * Action blueprints:
     *    `/comment/update`
     */
    /*
    update: function (req, res) {

        // Send a JSON response
        return res.json({
            result: 'fail(create/delete only)'
        });
    },
    */


    /**
     * Action blueprints:
     *    `/comment/destory/:id`
     */
    destory: function (req, res) {

        req.checkBody('id', common.gmsg.mustinput_id).notEmpty();
        req.checkBody('uid', common.gmsg.mustinput_uid).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        var id = req.body.id;
        var uid = req.body.uid;

        Comment.findOneAndUpdate({
            _id: id,
            uid: uid
        }, {
            $set: {
                status: '削除',
                upddate: new Date()
            }
        }, null, function (err, comment) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else {
                Comment.update({
                    path: {
                        '$regex': '^' + comment.path + '#'
                    }
                }, {
                    $set: {
                        status: '削除',
                        upddate: new Date()
                    }
                }, function (err, comments) {
                    console.log(comments);
                    if (err) console.error(err);
                    return res.json({
                        result: 'ok',
                        comment: comment
                    });
                });
            }
        });
    },

    search: function (req, res) {
        //common.glog.info(sails, '/comment/search:' + JSON.stringify(req.body));
        var searchConditions = {};
        if (req.body.content !== undefined)
            searchConditions.content = {
                $regex: new RegExp(req.body.content, 'i')
            };
        searchConditions.status = '公開';
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
        if (req.body.uid !== undefined)
            searchConditions.uid = req.body.uid;
        if (req.body.nid !== undefined)
            searchConditions.nid = req.body.nid;

        var searchOptions = {};
        if (req.body.limit !== undefined)
            searchOptions.limit = req.body.limit;
        if (req.body.skip !== undefined)
            searchOptions.skip = req.body.skip;

        var sortOptions = {
            upddate: -1
        };
        if (req.body.sortOptions !== undefined)
            sortOptions = req.body.sortOptions;

        // ツリー表示
        if (req.body.istreeshow) {
            // http://mongoosejs.com/docs/api.html
            // Model.find(conditions, [fields], [options], [callback])
            searchConditions.parent = {
                $exists: false
            };
            Comment.find(searchConditions, null, searchOptions).populate('uid').sort(sortOptions).exec(function (err, comments) {
                if (err)
                    return res.json({
                        result: 'fail',
                        err: err
                    });
                else {
                    // コメント全件計算のため、おやコメントのみ抽出条件を外します
                    delete searchConditions.parent;
                    Comment.count(searchConditions, function (err, count) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else {
                            async.map(comments, function (comment, cb) {
                                comment.getChildren(true, function (err, comments) {
                                    var data = {
                                        comment: comment,
                                        subcomments: comments
                                    };
                                    cb(null, data);
                                }, {
                                    status: searchConditions.status
                                });
                            }, function (err, results) {
                                return res.json({
                                    result: 'ok',
                                    comments: results,
                                    count: count
                                });
                            });
                        }
                    });
                }
            });
        } else {
            // http://mongoosejs.com/docs/api.html
            // Model.find(conditions, [fields], [options], [callback])
            Comment.find(searchConditions, null, searchOptions).populate('uid').sort(sortOptions).exec(function (err, comments) {
                if (err)
                    return res.json({
                        result: 'fail',
                        err: err
                    });
                else {
                    Comment.count(searchConditions, function (err, count) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else {
                            //console.log(comments);
                            return res.json({
                                result: 'ok',
                                comments: comments,
                                count: count
                            });
                        }
                    });
                }
            });
        }
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to CommentController)
     */
    _config: {}


};

function getCreateJSON(req) {
    return {
        nid: req.body.nid,
        uid: req.body.uid,
        content: req.body.content
    };
}

function updthreadupddate(nid, cb) {
    Thread.findOneAndUpdate({
        nid: nid
    }, {
        $set: {
            upddate: new Date()
        }
    }, cb);
}