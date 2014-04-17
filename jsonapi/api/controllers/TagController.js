/**
 * TagController
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
var common = require('../../../common');
var models = require('../models');
var Tag = models.Tag;

module.exports = {

    /**
     * Action blueprints:
     *    `/tag/index`
     *    `/tag`
     */
    index: function (req, res) {
        //return res.forbidden('You are not permitted to perform this action.');
        res.forbidden();
    },

    /**
     * Action blueprints:
     *    `/tag/create`
     */
    create: function (req, res) {
        req.checkBody('name', common.gmsg.mustinput_name).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }

        Tag.findOne({
            name: req.body.name
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
                    err: 'tag is aleady exist.'
                });
            } else {
                // 存在していない
                var tag = new Tag({
                    name: req.body.name,
                    desc: req.body.desc,
                    url: req.body.url
                });
                if (req.body.weight !== undefined)
                    tag.weight = req.body.weight;
                tag.save(function (err, newtag) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else
                        return res.json({
                            result: 'ok',
                            tag: newtag
                        });
                });
            }
        });
    },

    /**
     * Action blueprints:
     *    `/tag/:id`
     */
    find: function (req, res) {
        var id = req.param('id');
        Tag.findOne({
            _id: id
        }, function (err, tag) {
            if (err) return res.json({
                result: 'fail',
                err: err
            });
            return res.json({
                result: 'ok',
                tag: tag
            });
        });
    },

    /**
     * Action blueprints:
     *    `/tag/search`
     */
    search: function (req, res) {
        var searchConditions = {};
        searchConditions.status = '公開';
        if (req.body.status !== undefined)
            searchConditions.status = req.body.status;
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

        Tag.find(searchConditions, null, searchOptions).sort(sortOptions).exec(function (err, tags) {
            if (err) return res.json({
                result: 'fail',
                err: err
            });
            return res.json({
                result: 'ok',
                tags: tags
            });
        });
    },

    /**
     * Action blueprints:
     *    `/tag/destory`
     */
    destory: function (req, res) {
        var id = req.param('id');

        Tag.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                status: '削除'
            }
        }, null, function (err, tag) {
            if (err) return res.json({
                result: 'fail',
                err: err
            });
            return res.json({
                result: 'ok',
                tag: tag
            });
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to TagController)
     */
    _config: {}


};