/**
 * ContentNodeController
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
var ContentNode = models.ContentNode;

module.exports = {

    update: function (req, res) {
        req.checkBody('url', common.gmsg.mustinput_title).notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            return res.json({
                result: 'fail',
                errors: errors
            });
        }
        var id = req.param('id');
        ContentNode.findOne({
            _id: id
        }, function (err, cnode) {
            if (err)
                return res.json({
                    result: 'fail',
                    err: err
                });
            else {
                if (cnode) {
                    ContentNode.findOne({
                        url: req.body.url
                    }, function (err, tmpcnode) {
                        if (err)
                            return res.json({
                                result: 'fail',
                                err: err
                            });
                        else {
                            if (tmpcnode) {
                                // url既に存在している場合
                                return res.json({
                                    result: 'fail',
                                    err: req.body.url + ' url is existed.'
                                });
                            } else {
                                cnode.url = req.body.url;
                                cnode.save(function (err, newcnode) {
                                    if (err)
                                        return res.json({
                                            result: 'fail',
                                            err: err
                                        });
                                    else
                                        return res.json({
                                            result: 'ok',
                                            cnode: newcnode
                                        });
                                });
                            }
                        }
                    });
                } else {
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
     * (specific to ContentNodeController)
     */
    _config: {}


};