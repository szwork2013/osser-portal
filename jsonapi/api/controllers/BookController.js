/**
 * BookController
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
var Book = models.Book;

module.exports = {


    /**
     * Action blueprints:
     *    `/book/index`
     *    `/book`
     */
    index: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'index'
        });
    },


    /**
     * Action blueprints:
     *    `/book/create`
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
        Book.findOne(searchCondition, function (err, doc) {
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
                var book = new Book({
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
     *    `/book/find`
     */
    find: function (req, res) {
        var id = req.param('id');
        if (id) {
            Book.findOne({
                $or: [{
                    _id: id
                }, {
                    alias: id
                }]
            }).exec(function (err, book) {
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
     *    `/book/search`
     */
    search: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'search'
        });
    },


    /**
     * Action blueprints:
     *    `/book/update`
     */
    update: function (req, res) {
        var id = req.param('id');
        if (id) {
            Book.findOne({
                _id: id
            }, function (err, book) {
                if (err)
                    return res.json({
                        result: 'fail',
                        err: err
                    });
                else {
                    if (book) {
                        console.log(req.body);
                        for (var pname in req.body) {
                            if (req.body[pname] !== undefined)
                                book[pname] = req.body[pname];
                        }
                        console.log(book);
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
     * (specific to BookController)
     */
    _config: {}


};