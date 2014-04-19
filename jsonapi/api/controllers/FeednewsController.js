/**
 * FeednewsController
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
var FeedNews = models.FeedNews;
var ContentNode = models.ContentNode;

module.exports = {


    create: function (req, res) {
        req.checkBody('title', common.gmsg.mustinput_title).notEmpty();
        req.checkBody('link', 'link is must be inputed.').notEmpty();
        req.checkBody('guid', 'guid is must be inputed.').notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                err: errors
            });
        }

        FeedNews.findOne({
            guid: req.body.guid
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
                    err: 'this news is aleady exist.'
                });
            } else {
                // 存在していない
                createContentNode(function (err, cnode) {
                    if (err) return res.json({
                        result: 'fail',
                        err: err
                    });
                    var news = new FeedNews({
                        nid: cnode,
                        title: req.body.title,
                        link: req.body.link,
                        guid: req.body.guid
                    });
                    if (req.body.rsstitle !== undefined)
                        news.rsstitle = req.body.rsstitle;
                    if (req.body.summary !== undefined)
                        news.summary = req.body.summary;
                    if (req.body.description !== undefined)
                        news.description = req.body.description;
                    if (req.body.origlink !== undefined)
                        news.origlink = req.body.origlink;
                    if (req.body.date !== undefined)
                        news.date = req.body.date;
                    if (req.body.pubdate !== undefined)
                        news.pubdate = req.body.pubdate;
                    if (req.body.author !== undefined)
                        news.author = req.body.author;
                    if (req.body.comments !== undefined)
                        news.comments = req.body.comments;
                    if (req.body.image !== undefined)
                        news.image = req.body.image;
                    if (req.body.categories !== undefined)
                        news.categories = req.body.categories;
                    if (req.body.source !== undefined)
                        news.source = req.body.source;
                    if (req.body.enclosures !== undefined)
                        news.enclosures = req.body.enclosures;
                    if (req.body.meta !== undefined)
                        news.meta = req.body.meta;
                    if (req.body.summary !== undefined)
                        news.summary = req.body.summary;

                    news.save(function (err, newdoc) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else
                            return res.json({
                                result: 'ok',
                                news: newdoc
                            });
                    });
                });
            }
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to FeednewsController)
     */
    _config: {}


};

function createContentNode(cb) {
    var newnode = new ContentNode({});
    newnode.save(cb);
}