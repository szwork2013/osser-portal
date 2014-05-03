/**
 * AmzBrowseNodeController
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
var AmzBrowseNode = models.AmzBrowseNode;

module.exports = {


    /**
     * Action blueprints:
     *    `/amzbrowsenode/index`
     *    `/amzbrowsenode`
     */
    index: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/amzbrowsenode/create`
     */
    create: function (req, res) {
        req.checkBody('bnodeid', 'bnodeid is null').notEmpty();
        req.checkBody('name', 'name is null').notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                err: errors
            });
        }

        AmzBrowseNode.findOne({
            bnodeid: req.body.bnodeid
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
                    err: 'this browsenode is aleady exist.'
                });
            } else {
                var bnode = new AmzBrowseNode({
                    bnodeid: req.body.bnodeid,
                    name: req.body.name
                });
                if (req.body.children !== undefined)
                    bnode.children = req.body.children;
                bnode.save(function (err, newdoc) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else
                        return res.json({
                            result: 'ok',
                            bnode: newdoc
                        });
                });
            }
        });
    },

    /**
     * Action blueprints:
     *    `/amzbrowsenode/find`
     */
    find: function (req, res) {
        var id = req.param('id');
        if (id) {
            var searchConditions = {};
            if (models.isObjectId(id)) {
                searchConditions = {
                    _id: id
                };
            } else {
                searchConditions = {
                    bnodeid: id
                };
            }
            AmzBrowseNode.findOne(searchConditions).exec(function (err, bnode) {
                if (err) return res.json({
                    result: 'fail',
                    err: err
                });
                else {
                    if (bnode) {
                        return res.json({
                            result: 'ok',
                            bnode: bnode
                        });
                    } else {
                        return res.json({
                            result: 'fail',
                            err: 'data is null.'
                        });
                    }
                }
            });
        } else {
            return res.json({
                result: 'fail',
                err: 'id is null.'
            });
        }
    },

    /**
     * Action blueprints:
     *    `/amzbrowsenode/search`
     */
    search: function (req, res) {
        var searchConditions = {};
        if (req.body.name !== undefined) {
            searchConditions.name = {
                $regex: new RegExp(req.body.name, 'i')
            };
        }
        if (req.body.status !== undefined) {
            searchConditions.status = req.body.status;
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
        
        //console.log(searchConditions, searchOptions, sortOptions);
        AmzBrowseNode.find(searchConditions, null, searchOptions).sort(sortOptions).exec(function (err, docs) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                AmzBrowseNode.count(searchConditions, function (err, count) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else {
                        async.map(docs, function (bnode, cb) {
                            var result = {
                                bnode: bnode
                            };
                            cb(null, result);
                        }, function (err, results) {
                            return res.json({
                                result: 'ok',
                                bnodes: results,
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
     *    `/amzbrowsenode/remove`
     */
    remove: function (req, res) {
        var id = req.param('id');
        if (id) {
            var searchConditions = {};
            if (models.isObjectId(id)) {
                searchConditions = {
                    _id: id
                };
            } else {
                searchConditions = {
                    bnodeid: id
                };
            }
            AmzBrowseNode.findOneAndUpdate(searchConditions, {
                $set: {
                    status: '削除'
                }
            }, null, function (err, bnode) {
                if (err) return res.json({
                    result: 'fail',
                    err: err
                });
                else {
                    if (bnode) {
                        return res.json({
                            result: 'ok',
                            bnode: bnode
                        });
                    } else {
                        return res.json({
                            result: 'fail',
                            err: 'data is null.'
                        });
                    }
                }
            });
        } else {
            return res.json({
                result: 'fail',
                err: 'id is null.'
            });
        }
    },


    /**
     * Action blueprints:
     *    `/amzbrowsenode/update`
     */
    update: function (req, res) {
        var id = req.param('id');
        if (id) {
            var searchConditions = {};
            if (models.isObjectId(id)) {
                searchConditions = {
                    _id: id
                };
            } else {
                searchConditions = {
                    bnodeid: id
                };
            }
            AmzBrowseNode.findOne(searchConditions, function (err, bnode) {
                if (err)
                    return res.json({
                        result: 'fail',
                        err: err
                    });
                else {
                    if (bnode) {
                        for (var pname in req.body) {
                            if (req.body[pname] !== undefined)
                                bnode[pname] = req.body[pname];
                        }
                        bnode.update = new Date();
                        bnode.save(function (err, newdoc) {
                            if (err)
                                return res.json({
                                    result: 'fail',
                                    err: err
                                });
                            else
                                return res.json({
                                    result: 'ok',
                                    bnode: newdoc
                                });
                        });
                    } else {
                        return res.json({
                            result: 'ok',
                            err: 'data is null'
                        });
                    }
                }
            });
        } else {
            return res.json({
                result: 'fail',
                err: 'id is null.'
            });
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AmzBrowseNodeController)
     */
    _config: {}


};