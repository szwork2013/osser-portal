/**
 * HelpController
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
var fs = require('fs');
var sitemap = require('sitemap');
var RSS = new require('rss');
var common = require('../../../common');

module.exports = {


    index: function (req, res) {
        return res.json({
            result: 'help.index'
        });
    },

    /**
     * markdown文法説明
     */
    markdown: function (req, res) {
        fs.readFile('views/home/markdown.md', function (err, data) {
            if (err) return console.error(err);
            var markdownHelp = common.gmd.tohtml(data.toString());
            var form_data = {};
            form_data.markdownHelp = markdownHelp;
            form_data.meta_keywords = "markdown";
            form_data.meta_description = "Markdownの文法、記法説明トピックです。";

            common.gapi.portlet.rssnews(function (body) {
                form_data.rssnews = body;
                return res.view('home/markdown', {
                    title: 'Markdown文法説明',
                    gconfig: common.gconfig,
                    form: form_data
                });
            });
        });
    },

    /**
     * sitemap.xml
     * https://www.npmjs.org/package/sitemap
     * http://www.sitemaps.org/protocol.html
     */
    sitemap: function (req, res) {
        var sm = sitemap.createSitemap({
            hostname: common.gurl.addhttp(common.gconfig.url.nodejs),
            cacheTime: 60 * 1000,
            urls: []
        });

        sm.urls.push({
            url: '/',
            changefreq: 'always',
            priority: 1
        });
        sm.urls.push({
            url: '/nodejs/',
            changefreq: 'monthly',
            priority: 0.9
        });
        sm.urls.push({
            url: '/help/markdown',
            changefreq: 'monthly',
            priority: 0.9
        });

        common.gapi.post(common.gconfig.site.api.thread.search, {
            status: '公開'
        }, function (err, response, body) {
            if (err) return res.forbidden();
            if (body.threads) {
                body.threads.forEach(function (result, index) {
                    sm.urls.push({
                        url: '/thread/' + common.gfunc.getContentNodeUrl(result.thread.nid),
                        changefreq: 'daily',
                        priority: 0.5
                    });
                });
            }
            res.header('Content-Type', 'application/xml');
            return res.send(sm.toString());
        });
    },

    /**
     * rss.xml
     * https://github.com/dylang/node-rss
     */
    rss: function (req, res) {
        var feed = new RSS({
            title: common.gconfig.name,
            description: common.gconfig.description,
            generator: common.gconfig.name + ' RSS',
            feed_url: common.gurl.addhttp(common.gconfig.url.nodejs) + '/rss.xml',
            site_url: common.gurl.addhttp(common.gconfig.url.nodejs),
            image_url: common.gurl.addhttp(common.gconfig.url.nodejs) + '/images/osser.png',
            author: common.gconfig.author,
            language: 'ja',
            pubDate: Date.now(),
            ttl: 60
        });

        common.gapi.post(common.gconfig.site.api.thread.search, {
            status: '公開',
            limit: 50,
            skip: 0
        }, function (err, response, body) {
            if (err) return res.forbidden();
            //console.log(body);
            if (body.threads) {
                body.threads.forEach(function (result, index) {
                    //console.log(index);
                    feed.item({
                        title: result.thread.title,
                        description: result.thread.summary ? result.thread.summary : common.gmd.tohtml(result.thread.content),
                        author: result.thread.uid.username,
                        url: common.gurl.addhttp(common.gconfig.url.nodejs) + '/thread/' + common.gfunc.getContentNodeUrl(result.thread.nid),
                        date: result.thread.upddate
                    });
                });
            }
            res.header('Content-Type', 'application/xml');
            return res.send(feed.xml());
        });
    },


    newsrss: function (req, res) {
        var feed = new RSS({
            title: common.gconfig.name,
            description: common.gconfig.description,
            generator: common.gconfig.name + ' ニュースRSS',
            feed_url: common.gurl.addhttp(common.gconfig.url.nodejs) + '/newsrss.xml',
            site_url: common.gurl.addhttp(common.gconfig.url.nodejs),
            image_url: common.gurl.addhttp(common.gconfig.url.nodejs) + '/images/osser.png',
            author: common.gconfig.author,
            language: 'ja',
            pubDate: Date.now(),
            ttl: 60
        });

        common.gapi.feednews.search({
            status: '1',
            limit: 999,
            skip: 0,
            sortOptions: {
                date: -1
            }
        }, function (err, response, body) {
            if (err) return res.forbidden();
            //console.log(body);
            if (body.results) {
                body.results.forEach(function (result, index) {
                    //console.log(index);
                    feed.item({
                        title: result.news.title,
                        description: result.news.title,
                        author: result.news.author,
                        url: common.gurl.addhttp(common.gconfig.url.nodejs) + '/news/' + common.gfunc.getContentNodeUrl(result.news.nid),
                        date: result.news.date
                    });
                });
            }
            res.header('Content-Type', 'application/xml');
            return res.send(feed.xml());
        });


    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to HelpController)
     */
    _config: {}


};