/**
 * NewsfeedController
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
var NewsFeed = models.NewsFeed;

module.exports = {


    index: function (req, res) {
        return res.json({
            result: 'ok'
        });
    },

    create: function (req, res) {

        NewsFeed.findOne({
            link: req.body.link
        }, function (err, doc) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            if (doc) {
                // 既に存在している
                return res.json({
                    result: 'fail',
                    err: 'newsfeed is aleady exist.'
                });
            } else {
                // 存在していない
                var feed = new NewsFeed({
                    title: req.body.title,
                    link: req.body.link
                });
                if (req.body.desc !== undefined)
                    feed.desc = req.body.desc;
                feed.save(function (err, newdoc) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else
                        return res.json({
                            result: 'ok',
                            newsfeed: newdoc
                        });
                });
            }
        });
    },

    search: function (req, res) {
        var searchConditions = {};
        if (req.body.title !== undefined)
            searchConditions.title = req.body.title;
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
        NewsFeed.find(searchConditions, function (err, docs) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                return res.json({
                    result: 'ok',
                    docs: docs
                });
            }
        });
    },

    update: function (req, res) {
        var id = req.param('id');
        NewsFeed.findOne({
            _id: id
        }, function (err, doc) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                if (doc) {
                    if (req.body.title !== undefined)
                        doc.title = req.body.title;
                    if (req.body.title !== undefined)
                        doc.title = req.body.title;
                    if (req.body.link !== undefined)
                        doc.link = req.body.link;
                    if (req.body.desc !== undefined)
                        doc.desc = req.body.desc;
                    if (req.body.status !== undefined)
                        doc.status = req.body.status;
                    doc.save(function (err, newdoc) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else
                            return res.json({
                                result: 'ok',
                                newsfeed: newdoc
                            });
                    });
                } else {
                    return res.json({
                        result: 'fail',
                        err: 'data is not exists.'
                    });
                }
            }
        });
    },

    destory: function (req, res) {
        var id = req.param('id');
        NewsFeed.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                status: '0'
            }
        }, null, function (err, feed) {
            if (err) return res.json({
                result: 'fail',
                err: err
            });
            return res.json({
                result: 'ok',
                newsfeed: feed
            });
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to NewsfeedController)
     */
    _config: {}


};