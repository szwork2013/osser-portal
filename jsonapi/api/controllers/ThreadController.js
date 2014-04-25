/**
 * ThreadController
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
var OssDocument = models.OssDocument;
var ContentNode = models.ContentNode;
var Thread = models.Thread;
var Comment = models.Comment;

module.exports = {


    /**
     * Action blueprints:
     *    `/thread/index`
     *    `/thread`
     */
    index: function (req, res) {
        return res.redirect('/');
    },


    /**
     * Action blueprints:
     *    `/thread/create`
     */
    create: function (req, res) {

        req.checkBody('title', common.gmsg.mustinput_title).notEmpty();
        req.checkBody('uid', common.gmsg.mustinput_uid).notEmpty();
        req.checkBody('content', common.gmsg.mustinput_content).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        findOssNodejs(function (err, nodejs) {
            if (err)
                return res.json({
                    result: 'ok',
                    err: err
                });
            else {
                createContentNode(function (err, cnode) {
                    var newthread = new Thread({
                        nid: cnode,
                        uid: req.body.uid,
                        ossid: nodejs,
                        title: req.body.title,
                        summary: req.body.summary,
                        content: req.body.content,
                        status: req.body.status === undefined ? '公開' : req.body.status
                    });
                    newthread.save(function (err, newdoc, count) {
                        if (err)
                            res.json({
                                result: 'fail',
                                err: err
                            });
                        else
                            res.json({
                                result: 'ok',
                                id: newdoc._id
                            });
                    });
                });
            }
        });
    },


    /**
     * Action blueprints:
     *    `/thread/:id`
     */
    find: function (req, res) {
        var id = req.param('id');
        Thread.findOne({
            _id: id
        }, function (err, doc) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else
                return res.json({
                    result: 'ok',
                    thread: doc
                });
        });
    },

    /**
     * Action blueprints:
     *    `/thread/:nid`
     */
    findBynid: function (req, res) {
        var cnid = '';
        var nid = req.param('id');
        var searchConditions = {};

        if (models.isObjectId(nid)) {
            searchConditions = {
                $or: [{
                    _id: nid
                }, {
                    url: nid
                }]
            };
        } else {
            searchConditions = {
                url: nid
            };
        }

        //console.log(searchConditions);
        ContentNode.findOne(searchConditions, function (err, cnode) {
            if (err)
                return res.josn({
                    result: 'fail',
                    err: err
                });
            else {
                if (cnode) {
                    cnid = cnode._id;
                    Thread.findOneAndUpdate({
                        nid: cnid
                    }, {
                        $inc: {
                            "visitedcount": 1
                        }
                    }).populate('uid').exec(function (err, doc) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else {
                            return res.json({
                                result: 'ok',
                                thread: doc
                            });
                        }
                    });
                } else {
                    console.error(searchConditions);
                    return res.json({
                        result: 'fail',
                        err: 'data is null'
                    });
                }
            }
        });
    },

    /**
     * Action blueprints:
     *    `/thread/update/:id`
     */
    update: function (req, res) {

        req.checkBody('title', common.gmsg.mustinput_title).notEmpty();
        req.checkBody('content', common.gmsg.mustinput_content).notEmpty();
        req.checkBody('uid', common.gmsg.mustinput_uid).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        var uid = req.body.uid;
        var id = req.param('id');
        Thread.findOne({
            _id: id
        }, function (err, thread) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                if (thread) {
                    if (uid == thread.uid) {
                        if (req.body.title !== undefined)
                            thread.title = req.body.title;
                        if (req.body.summary !== undefined)
                            thread.summary = req.body.summary;
                        if (req.body.content !== undefined)
                            thread.content = req.body.content;
                        if (req.body.status !== undefined)
                            thread.status = req.body.status;
                        if (req.body.weight !== undefined)
                            thread.weight = req.body.weight;
                        if (req.body.bookey !== undefined)
                            thread.bookey = req.body.bookey;

                        thread.upddate = new Date();
                        thread.save(function (err, newthread) {
                            if (err)
                                return res.json({
                                    result: 'fail',
                                    err: err
                                });
                            else
                                return res.json({
                                    result: 'ok',
                                    thread: newthread
                                });
                        });
                    } else {
                        return res.json({
                            result: 'fail',
                            err: '自分のスレッドしか更新できない'
                        });
                    }
                } else {
                    return res.json({
                        result: 'data is null'
                    });
                }
            }
        });
    },

    /**
     * Action blueprints:
     *    `/thread/destory/:id`
     */
    destory: function (req, res) {

        var id = req.param('id');
        var uid = req.body.uid;
        Thread.findOne({
            _id: id
        }, function (err, thread) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                if (thread) {
                    if (uid == thread.uid) {
                        Thread.findOneAndUpdate({
                            _id: id
                        }, {
                            $set: {
                                status: '削除'
                            }
                        }, null, function (err, thread) {
                            if (err)
                                res.json({
                                    result: 'fail',
                                    err: err
                                });
                            else {
                                return res.json({
                                    result: 'ok',
                                    thread: thread
                                });
                            }
                        });
                    } else {
                        return res.json({
                            result: 'fail'
                        });
                    }
                } else
                    return res.json({
                        result: 'fail'
                    });
            }
        });
    },

    /**
     * 個人コメントから投稿を検索する
     * /thread/searchFromComment
     */
    searchFromComment: function (req, res) {
        common.glog.info(sails, '/thread/searchFromComment:' + JSON.stringify(req.body));
        req.checkBody('uid', common.gmsg.mustinput_uid).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }
        var searchConditions = {};
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
        if (req.body.uid !== undefined)
            searchConditions.uid = req.body.uid;
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
        Comment.find(searchConditions, null, searchOptions).sort(sortOptions).exec(function (err, docs) {
            if (err) return res.json({
                result: 'fail',
                err: err
            });
            async.map(docs, function (comment, cb) {
                cb(null, comment.nid);
            }, function (err, results) {
                console.log(results);
                Thread.find({
                    nid: {
                        $in: results
                    }
                }).populate('nid').populate('uid').sort(sortOptions).exec(function (err, threads) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else {
                        Thread.count({
                            nid: {
                                $in: results
                            }
                        }, function (err, count) {
                            if (err)
                                return res.json({
                                    result: 'fail',
                                    err: err
                                });
                            else {
                                async.map(threads, function (thread, cb) {
                                    Comment.count({
                                        nid: thread.nid,
                                        status: '公開'
                                    }, function (err, count) {
                                        if (err) console.error(err);
                                        var result = {
                                            thread: thread,
                                            commentcount: count
                                        };
                                        cb(null, result);
                                    });
                                }, function (err, results) {
                                    return res.json({
                                        result: 'ok',
                                        threads: results,
                                        count: count
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    },
    /**
     * Action blueprints:
     *    `/thread/search`
     */
    search: function (req, res) {
        //common.glog.info(sails, '/thread/search:' + JSON.stringify(req.body));
        var searchConditions = {};
        if (req.body.content !== undefined)
            searchConditions.content = {
                $regex: new RegExp(req.body.content, 'i')
            };
        if (req.body.title !== undefined) {
            searchConditions.title = {
                $regex: new RegExp(req.body.title, 'i')
            };
        }
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
        if (req.body.uid !== undefined)
            searchConditions.uid = req.body.uid;

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

        // http://mongoosejs.com/docs/api.html
        // Model.find(conditions, [fields], [options], [callback])
        Thread.find(searchConditions, null, searchOptions).populate('nid').populate('uid').sort(sortOptions).exec(function (err, threads) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                Thread.count(searchConditions, function (err, count) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else {
                        async.map(threads, function (thread, cb) {
                            Comment.count({
                                nid: thread.nid,
                                status: '公開'
                            }, function (err, count) {
                                if (err) console.error(err);
                                var result = {
                                    thread: thread,
                                    commentcount: count
                                };
                                cb(null, result);
                            });
                        }, function (err, results) {
                            return res.json({
                                result: 'ok',
                                threads: results,
                                count: count
                            });
                        });
                    }
                });
            }
        });
    },

    /**
     * Action blueprints:
     *    `/thread/count`
     */
    count: function (req, res) {
        //common.glog.info(sails, '/thread/count:' + JSON.stringify(req.body));
        var searchConditions = {};
        if (req.body.content !== undefined)
            searchConditions.content = {
                $regex: new RegExp(req.body.content, 'i')
            };
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
        if (req.body.uid !== undefined)
            searchConditions.uid = req.body.uid;

        Thread.count(searchConditions, function (err, count) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else
                return res.json({
                    result: 'ok',
                    count: count
                });
        });
    },

    updatebookey: function (req, res) {
        var id = req.param('id');

        var searchConditions = {};
        if (models.isObjectId(id)) {
            searchConditions = {
                _id: id
            };
        } else {
            searchConditions = {
                url: id
            };
        }

        ContentNode.findOne(searchConditions, function (err, cnode) {
            if (err)
                return res.josn({
                    result: 'fail',
                    err: err
                });
            else {
                if (cnode) {
                    cnid = cnode._id;
                    Thread.findOneAndUpdate({
                        nid: cnid
                    }, {
                        bookey: req.body.bookey
                    }).populate('uid').exec(function (err, doc) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else {
                            return res.json({
                                result: 'ok',
                                thread: doc
                            });
                        }
                    });
                } else {
                    console.error(searchConditions);
                    return res.json({
                        result: 'fail',
                        err: 'data is null'
                    });
                }
            }
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ThreadController)
     */
    _config: {}


};

var m_nodejs = null;

function findOssNodejs(cb) {
    if (m_nodejs == null)
        OssDocument.findOne({
            name: 'Node.js',
            homepage: 'http://nodejs.org/'
        }, function (err, nodejs) {
            m_nodejs = nodejs;
            cb(err, nodejs);
        });
    else
        cb(null, m_nodejs);
}

function createContentNode(cb) {
    var newnode = new ContentNode({});
    newnode.save(cb);
}