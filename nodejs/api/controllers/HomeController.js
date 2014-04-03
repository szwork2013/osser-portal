/**
 * HomeController
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

module.exports = {


    /**
     * Action blueprints:
     *    `/home/index`
     *    `/home`
     */
    index: function (req, res) {
        var form_data = {};

        // 検索ボックスのキーワードをクリア
        req.session.sbox_keyword = undefined;
        req.session.sbox_uid = undefined;

        common.gapi.post(common.gconfig.site.api.thread.search, {
            status: '公開',
            limit: common.gconfig.pagesize,
            skip: 0
        }, function (err, response, body) {
            if (err) next(err);
            else {
                if (body.result == 'ok') {
                    form_data.threadlist = {
                        threads: body.threads,
                        actionurl: common.gconfig.site.nodejs.route.thread
                    }
                    form_data.pager = common.gfunc.getpager(body.count, 1);
                    form_data.pager.activeindex = 1;
                    form_data.pager.actionurl = common.gconfig.site.nodejs.route.search;
                    form_data.hotthreads = req.flash('hotthreads');
                    return res.view('home/index', {
                        title: 'Node.jsコミュニティ',
                        gconfig: common.gconfig,
                        gfunc: common.gfunc,
                        form: form_data
                    });
                } else {
                    return res.forbidden();
                }
            }
        });
    },


    /**
     * Node.jsとは
     */
    nodejs: function (req, res) {
        var form_data = {};
        return res.view('home/nodejs', {
            title: 'Node.jsとは',
            gconfig: common.gconfig,
            form: form_data
        });
    },

    /**
     * /search/:pageindex
     */
    search: function (req, res) {
        var form_data = {};
        var pageindex = req.param('id');
        if (pageindex === undefined)
            pageindex = 1;
        var keyword = req.body.sbox_keyword;
        var seachCondition = {
            status: '公開',
            limit: common.gconfig.pagesize,
            skip: (pageindex - 1) * common.gconfig.pagesize
        };
        if (keyword !== undefined && keyword) {
            seachCondition.content = keyword;
            req.session.sbox_keyword = keyword;
        } else {
            if (req.session.sbox_keyword)
                seachCondition.content = req.session.sbox_keyword;
        }
        var uid = req.query.uid;
        if (uid !== undefined) {
            seachCondition.uid = uid;
            req.session.sbox_uid = uid;
        } else {
            if (req.session.sbox_uid)
                seachCondition.uid = req.session.sbox_uid;
        }
        common.gapi.post(common.gconfig.site.api.thread.search, seachCondition, function (err, response, body) {
            if (err) next(err);
            else {
                if (body.result === 'ok') {
                    common.gapi.post(common.gconfig.site.api.searchresult.create, {
                        keyword: keyword,
                        clientip: common.gfunc.getClientIpByProxy(req)
                    }, function (err1, response1, body1) {});
                    form_data.threadlist = {
                        threads: body.threads,
                        actionurl: common.gconfig.site.nodejs.route.thread
                    }
                    form_data.pager = common.gfunc.getpager(body.count, pageindex);
                    form_data.pager.actionurl = common.gconfig.site.nodejs.route.search;
                    form_data.pager.activeindex = pageindex;
                    return res.view('home/search', {
                        title: 'Node.js投稿検索',
                        gconfig: common.gconfig,
                        gfunc: common.gfunc,
                        form: form_data
                    });
                } else {
                    return res.forbidden();
                }
            }
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to HomeController)
     */
    _config: {}


};