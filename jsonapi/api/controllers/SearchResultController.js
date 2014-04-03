/**
 * SearchResultController
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
var SearchResult = models.SearchResult;

module.exports = {


    create: function (req, res) {
        req.checkBody('keyword', common.gmsg.mustinput_content).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }
        var searchresult = new SearchResult({
            keyword: req.body.keyword,
            ip: req.body.clientip
        });
        searchresult.save(function (err, newsearchresult) {
            if (err) {
                return res.json({
                    result: 'fail',
                    err: err
                });
            } else {
                return res.json({
                    result: 'ok',
                    id: newsearchresult._id
                });
            }
        });
    },

    /**
     * 検索キーワード抽出
     */
    search: function (req, res) {
        var searchConditions = {};
        var searchOptions = {};
        if (req.body.limit !== undefined)
            searchOptions.limit = req.body.limit;
        if (req.body.skip !== undefined)
            searchOptions.skip = req.body.skip;
        var sortOptions = {
            upddate: -1
        };
        SearchResult.find(searchConditions, null, searchOptions).sort(sortOptions).exec(function (err, results) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                SearchResult.count(searchConditions, function (err, count) {
                    if (err)
                        return res.json({
                            result: 'fail',
                            err: err
                        });
                    else {
                        //console.log(comments);
                        return res.json({
                            result: 'ok',
                            results: results,
                            count: count
                        });
                    }
                });
            }
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SearchResultController)
     */
    _config: {}


};