/**
 * AmzBookNodeController
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
var AmzBookNode = models.AmzBookNode;

module.exports = {

    /**
     * Action blueprints:
     *    `/amzbooknode/index`
     *    `/amzbooknode`
     */
    index: function (req, res) {
        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/amzbooknode/create`
     */
    create: function (req, res) {
        req.checkBody('title', common.gmsg.mustinput_title).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                err: errors
            });
        }
        var searchCondition = {
            $or: []
        };
        if (req.body.title)
            searchCondition.$or.push({
                title: req.body.title
            });
        if (req.body.isbn10)
            searchCondition.$or.push({
                isbn10: req.body.isbn10
            });
        if (req.body.isbn13)
            searchCondition.$or.push({
                isbn13: req.body.isbn13
            });
        if (req.body.asin)
            searchCondition.$or.push({
                asin: req.body.asin
            });
        AmzBookNode.findOne(searchCondition, function (err, doc) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            if (doc) {
                // 既に存在している
                return res.json({
                    result: 'fail',
                    err: 'this book is aleady exist.'
                });
            } else {
                var book = new AmzBookNode({
                    title: req.body.title
                });
                for (var pname in req.body) {
                    if (req.body[pname] !== undefined)
                        book[pname] = req.body[pname];
                }
                book.save(function (err, newdoc) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else
                        return res.json({
                            result: 'ok',
                            book: newdoc
                        });
                });
            }
        });
    },


    /**
     * Action blueprints:
     *    `/amzbooknode/remove`
     */
    remove: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/amzbooknode/find`
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
                    alias: id
                };
            }
            //console.log('json.book.find', searchConditions);
            AmzBookNode.findOne(searchConditions).exec(function (err, book) {
                if (err) return res.json({
                    result: 'fail',
                    err: err
                });
                else {
                    if (book) {
                        return res.json({
                            result: 'ok',
                            book: book
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
     *    `/amzbooknode/search`
     */
    search: function (req, res) {
        var searchConditions = {};
        if (req.body.status !== undefined) {
            searchConditions.status = req.body.status;
        }
        if (req.body.asin !== undefined) {
            searchConditions.asin = req.body.asin;
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

        //console.log(searchConditions,searchOptions,sortOptions);
        AmzBookNode.find(searchConditions, null, searchOptions).sort(sortOptions).exec(function (err, docs) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                AmzBookNode.count(searchConditions, function (err, count) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else {
                        async.map(docs, function (book, cb) {
                            var result = {
                                book: book
                            };
                            cb(null, result);
                        }, function (err, results) {
                            return res.json({
                                result: 'ok',
                                books: results,
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
     *    `/amzbooknode/update`
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
                    alias: id
                };
            }
            AmzBookNode.findOne(searchConditions, function (err, book) {
                if (err)
                    return res.json({
                        result: 'fail',
                        err: err
                    });
                else {
                    if (book) {
                        for (var pname in req.body) {
                            if (req.body[pname] !== undefined)
                                book[pname] = req.body[pname];
                        }
                        book.save(function (err, newbook) {
                            if (err)
                                return res.json({
                                    result: 'fail',
                                    err: err
                                });
                            else
                                return res.json({
                                    result: 'ok',
                                    book: newbook
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
     * (specific to AmzBookNodeController)
     */
    _config: {}


};