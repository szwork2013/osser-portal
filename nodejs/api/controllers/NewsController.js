/**
 * NewsController
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
     *    `/news/index`
     *    `/news`
     */
    index: function (req, res) {
        return makenewspaging(req, res, 1);
    },


    /**
     * Action blueprints:
     *    `/news/find`
     */
    find: function (req, res) {
        var nid = req.param('id');

        if (nid) {
            common.gapi.feednews.find(nid, function (err, response, body) {
                if (err) {
                    console.error(err);
                    return res.forbidden();
                } else {
                    if (body.result === 'ok') {
                        //console.log(body);
                        var form_data = {
                            news: body.news,
                            prev: body.prev,
                            next: body.next,
                            hotthreads: req.flash('hotthreads')
                        };
                        common.gapi.portlet.recentthreads(function (body) {
                            form_data.recentthreads = body;
                            return res.view('home/newsdetail', {
                                title: '総合ニュース',
                                gconfig: common.gconfig,
                                gfunc: common.gfunc,
                                form: form_data
                            });
                        });
                    } else {
                        console.error(body);
                        return res.notFound();
                    }
                }
            });
        } else {
            return res.forbidden();
        }
    },


    /**
     * Action blueprints:
     *    `/news/search`
     */
    search: function (req, res) {
        var pageindex = +req.param('id');
        if (_.isNaN(pageindex)) pageindex = 1;
        return makenewspaging(req, res, pageindex);
    },




    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to NewsController)
     */
    _config: {}


};

function makenewspaging(req, res, pageindex) {
    common.gapi.feednews.search({
        status: '1',
        limit: common.gconfig.pagesize,
        skip: (pageindex - 1) * common.gconfig.pagesize,
        sortOptions: {
            date: -1
        }
    }, function (err, response, body) {
        if (err) {
            console.error(err);
            return res.forbidden();
        } else {
            var form_data = {
                news: body.results,
                hotthreads: req.flash('hotthreads')
            };
            form_data.pager = common.gfunc.getpager(body.count, pageindex);
            form_data.pager.actionurl = common.gconfig.site.nodejs.route.newssearch;
            form_data.pager.activeindex = pageindex;
            return res.view('home/newslist', {
                title: '総合ニュース',
                gconfig: common.gconfig,
                gfunc: common.gfunc,
                form: form_data
            });
        }
    });
}