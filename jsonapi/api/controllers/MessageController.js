/**
 * MessageController
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
var Message = models.Message;

module.exports = {

    /**
     * Action blueprints:
     *    `/message/index`
     *    `/message`
     */
    index: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'message'
        });
    },


    /**
     * /message/create
     */
    create: function (req, res) {
        req.checkBody('tid', common.gmsg.mustinput_tid).notEmpty();
        req.checkBody('content', common.gmsg.mustinput_content).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        var message = new Message(getCreateJSON(req));
        message.parent = req.body.pid;
        message.save(function (err, newmessage) {
            if (err) {
                return res.json({
                    result: 'fail',
                    err: err
                });
            } else {
                return res.json({
                    result: 'ok',
                    message: newmessage
                });
            }
        });
    },


    /**
     * /message/destory
     */
    destory: function (req, res) {
        req.checkBody('id', common.gmsg.mustinput_id).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        Message.findOneAndUpdate({
            _id: req.body.id
        }, {
            $set: {
                status: '削除',
                upddate: new Date()
            }
        }, null, function (err, message) {
            if (err)
                res.json({
                    result: 'fail',
                    err: err
                });
            else {
                Message.update({
                    path: {
                        '$regex': '^' + message.path + '#'
                    }
                }, {
                    $set: {
                        status: '削除',
                        upddate: new Date()
                    }
                }, function (err, messages) {
                    if (err) console.error(err);
                    return res.json({
                        result: 'ok',
                        message: message
                    });
                });
            }
        });
    },


    /**
     * 送信者のメッセージ一覧を取得
     * /message/search
     */
    search: function (req, res) {
//        req.checkBody('fid', common.gmsg.mustinput_fid).notEmpty();
//        var errors = req.validationErrors(true);
//        if (errors) {
//            return res.json({
//                result: 'fail',
//                errors: errors
//            });
//        }

        var searchConditions = {};
        if (req.body.content !== undefined)
            searchConditions.content = {
                $regex: new RegExp(req.body.content, 'i')
            };
        searchConditions.status = '公開';
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
        if (req.body.fid !== undefined)
            searchConditions.fid = req.body.fid;
        if (req.body.tid !== undefined)
            searchConditions.tid = req.body.tid;
        if (req.body.ftid !== undefined) {
            // fid or tid
            searchConditions.$or = [{
                fid: req.body.ftid
            }, {
                tid: req.body.ftid
            }];
        }

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

        if (req.body.isparentonly) {
            // http://mongoosejs.com/docs/api.html
            // Model.find(conditions, [fields], [options], [callback])
            searchConditions.parent = {
                $exists: false
            };
        }
        // http://mongoosejs.com/docs/api.html
        // Model.find(conditions, [fields], [options], [callback])
        Message.find(searchConditions, null, searchOptions).populate('fid').populate('tid').sort(sortOptions).exec(function (err, messages) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                Message.count(searchConditions, function (err, count) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else {
                        return res.json({
                            result: 'ok',
                            messages: messages,
                            count: count
                        });
                    }
                });
            }
        });
    },


    /**
     * メッセージのサブメッセージを取得
     * /message/find
     */
    find: function (req, res) {
        req.checkBody('id', common.gmsg.mustinput_id).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        Message.findOne({
            _id: req.body.id
        }, function (err, message) {
            if (err) return res.json({
                result: 'fail',
                err: err
            });
            if (message) {
                message.getChildren(true, function (err, messages) {
                    if (err) return res.json({
                        result: 'fail',
                        err: err
                    });
                    return res.json({
                        result: 'ok',
                        message: message,
                        messages: messages
                    });
                });
            } else {
                return res.json({
                    result: 'fail',
                    err: 'message is null.'
                });
            }
        });

    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to MessageController)
     */
    _config: {}


};

function getCreateJSON(req) {
    return {
        fid: req.body.fid,
        tid: req.body.tid,
        content: req.body.content
    };
}