/**
 * ThreadController
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
     *    `/thread/index`
     *    `/thread`
     */
    index: function (req, res) {
        var nid = req.param('id');
        // Send a JSON response
        return res.json({
            hello: '/thead/index',
            nid: nid
        });
    },

    find: function (req, res) {
        var form_data = {};
        var nid = req.param('id');

        if (nid) {
            form_data.nid = nid; // nid or url
            common.gapi.get(common.gconfig.site.api.thread.findBynid + '/' + form_data.nid, function (err, response, body) {
                if (err) next(err);
                if (body.result === 'ok') {
                    form_data.nid = body.thread.nid;
                    form_data.author = common.gfunc.setSSOLoginResult(common.gfunc.setLoginResult(body.thread.uid));
                    form_data.thread = body.thread;
                    form_data.showcontent = common.gmd.tohtml(body.thread.content);
                    form_data.commentmsg = common.gfunc.getflash(req, 'commentmsg');
                    form_data.meta_description = body.thread.summary ? body.thread.summary : body.thread.content.substring(0, 255);
                    common.gapi.post(common.gconfig.site.api.comment.search, {
                        nid: body.thread.nid,
                        sortOptions: {
                            upddate: 1
                        },
                        istreeshow: true
                    }, function (err, response, body) {
                        //console.log(body);
                        if (body.result === 'ok') {
                            //console.log(body.comments[0].comment);
                            form_data.comments = body.comments;
                            form_data.commentcount = body.count;
                            form_data.hotthreads = req.flash('hotthreads');
                            //console.log(form_data);
                            return res.view('home/threadshow', {
                                title: form_data.thread.title,
                                gconfig: common.gconfig,
                                gfunc: common.gfunc,
                                gmd: common.gmd,
                                form: form_data
                            });
                        } else {
                            return res.forbidden();
                        }
                    });
                } else {
                    console.error(body);
                    return res.forbidden();
                }
            });
        } else {
            return res.forbidden();
        }
    },


    createcomment: function (req, res) {
        switch (req.method) {
        case 'POST':
            var nid = req.body.nid;
            var pid = req.body.pid;
            var comment = req.body.comment;
            var goback = common.gconfig.site.nodejs.route.thread + '/' + nid;
            common.gapi.post(common.gconfig.site.api.comment.create, {
                uid: req.session.osser.uid,
                nid: req.body.nid,
                pid: req.body.pid,
                content: comment
            }, function (err, response, body) {
                if (err) next(err);
                if (body.result === 'ok') {
                    addExperience(1, req);
                    req.session.osser.experience += 1;
                    return res.redirect(goback);
                } else {
                    console.error(body);
                    if (body.errors !== undefined) {
                        if (body.errors.content !== undefined)
                            req.flash('commentmsg', body.errors.content.msg);
                        return res.redirect(goback);
                    } else {
                        return res.forbidden();
                    }
                }
            });
            break;
        default:
            return res.forbidden();
            break;
        }
    },

    removecomment: function (req, res) {
        var urlparams = req.param('id').split(',');
        if (urlparams.length != 2)
            return res.forbidden();
        var comment_id = urlparams[0];
        var nid = urlparams[1];
        var uid = req.session.osser.uid;
        var goback = common.gconfig.site.nodejs.route.thread + '/' + nid;
        common.gapi.post(common.gconfig.site.api.comment.destory, {
            id: comment_id,
            uid: uid
        }, function (err, response, body) {
            if (err) next(err);
            switch (body.result) {
            case 'ok':
                return res.redirect(goback);
                break;
            default:
                return res.forbidden();
                break;
            }
        });
    },

    newthread: function (req, res) {
        var form_data = {
            btnaction: req.body.btnAction
        };
        if (req.session.osser) {
            switch (req.method) {
            case 'GET':
                //console.log(req.session.osser);
                //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                form_data = req.session.osser;
                form_data.title = common.gfunc.getflash(req, 'title');
                form_data.summary = common.gfunc.getflash(req, 'summary');
                form_data.content = common.gfunc.getflash(req, 'content');
                return res.view('home/threadnew', {
                    title: '投稿',
                    gconfig: common.gconfig,
                    form: form_data,
                    msg: ''
                });
                break;
            case 'POST':
                //console.log('btnAction=' + req.body.btnAction);

                switch (form_data.btnaction) {
                case 'create':
                case 'draft':
                    common.gapi.post(common.gconfig.site.api.thread.create, {
                        uid: req.session.osser.uid,
                        title: req.body.title,
                        summary: req.body.summary,
                        content: req.body.content,
                        status: form_data.btnaction == 'create' ? '公開' : '下書き'
                    }, function (err, response, body) {
                        if (err) console.error(err);
                        //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                        form_data = req.session.osser;
                        form_data.title = req.body.title;
                        form_data.summary = req.body.summary;
                        form_data.content = req.body.content;
                        switch (body.result) {
                        case 'ok':
                            // 新規投稿は１０ポイント付与をする
                            //if (req.body.btnAction === 'create') {
                                addExperience(10, req);
                                req.session.osser.experience += 10;
                            //}
                            return res.redirect(common.gconfig.site.nodejs.route.user + '/' + req.session.osser.myurl);
                            break;
                        default:
                            if (body.errors.title !== undefined)
                                form_data.titlemsg = body.errors.title.msg;
                            if (body.errors.content !== undefined)
                                form_data.contentmsg = body.errors.content.msg;
                            return res.view('home/threadnew', {
                                title: '投稿',
                                gconfig: common.gconfig,
                                form: form_data,
                                msg: common.gmsg.result_create_failure,
                                alert: 'alert-danger'
                            });
                            break;
                        }
                    });
                    break;
                case 'preview':
                    req.flash('title', req.body.title);
                    req.flash('summary', req.body.summary);
                    req.flash('content', req.body.content);
                    req.flash('goback', req.url);
                    return res.redirect(common.gconfig.site.nodejs.route.threadpreview);
                default:
                    return res.forbidden();
                    break;
                }
                break;
            default:
                return res.forbidden();
            }
        } else {
            return res.redirect(common.gconfig.url.account + common.gconfig.site.account.route.login);
        }
    },


    /**
     * /thread/preview
     */
    preview: function (req, res) {

        var form_data = {};
        //if (req.session.osser) {
        //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
        form_data = req.session.osser;
        switch (req.method) {
        case 'GET':
            var goback = common.gfunc.getflash(req, 'goback');
            var title = common.gfunc.getflash(req, 'title');
            var summary = common.gfunc.getflash(req, 'summary');
            var content = common.gfunc.getflash(req, 'content');
            form_data.goback = abc(goback);
            form_data.title = abc(title);
            form_data.showtitle = title;
            form_data.summary = abc(summary);
            form_data.showsummary = summary;
            form_data.content = abc(content);
            form_data.showcontent = common.gmd.tohtml(content);
            return res.view('home/threadpreview', {
                title: '投稿プレビュー',
                gconfig: common.gconfig,
                form: form_data
            });
            break;
        case 'POST':
            try {
                req.flash('title', cba(req.body.title));
                req.flash('summary', cba(req.body.summary));
                req.flash('content', cba(req.body.content));
                return res.redirect(cba(req.body.goback));
            } catch (e) {
                return res.forbidden();
            }
            break;
        default:
            return res.forbidden();
        }
    },

    /**
     * /thread/edit/:nid
     */
    edit: function (req, res) {
        var form_data = {};
        var nid = req.param('id');
        if (nid) {
            try {
                switch (req.method) {
                case 'GET':
                    common.gapi.get(common.gconfig.site.api.thread.findBynid + '/' + nid, function (err, response, body) {
                        //console.log(body);
                        if (body.result == 'ok') {
                            if (body.thread.uid._id == req.session.osser.uid) {
                                //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                                form_data = req.session.osser;
                                //console.log(req.header('referer'));
                                form_data.title = common.gfunc.getflash(req, 'title');
                                form_data.summary = common.gfunc.getflash(req, 'summary');
                                form_data.content = common.gfunc.getflash(req, 'content');
                                if (!form_data.title)
                                    form_data.title = body.thread.title;
                                if (!form_data.summary)
                                    form_data.summary = body.thread.summary;
                                if (!form_data.content)
                                    form_data.content = body.thread.content;
                                return res.view('home/threadedit', {
                                    title: '投稿編集',
                                    gconfig: common.gconfig,
                                    form: form_data,
                                    msg: ''
                                });
                            } else {
                                return res.forbidden();
                            }
                        } else {
                            return res.forbidden();
                        }
                    });
                    break;
                case 'POST':
                    form_data.btnaction = req.body.btnAction;
                    switch (form_data.btnaction) {
                    case 'update':
                    case 'draft':
                        var status = '';
                        switch (form_data.btnaction) {
                        case 'update':
                            status = '公開';
                            break;
                        case 'draft':
                            status = '下書き';
                            break;
                        }
                        common.gapi.get(common.gconfig.site.api.thread.findBynid + '/' + nid, function (err, response, body) {
                            if (body.result == 'ok') {
                                if (body.thread.uid._id == req.session.osser.uid) {
                                    common.gapi.post(common.gconfig.site.api.thread.update + '/' + body.thread._id, {
                                        uid: req.session.osser.uid,
                                        title: req.body.title,
                                        summary: req.body.summary,
                                        content: req.body.content,
                                        status: status
                                    }, function (err, response, body) {
                                        if (err) next(err);
                                        else {
                                            //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
                                            form_data = req.session.osser;
                                            form_data.title = req.body.title;
                                            form_data.summary = req.body.summary;
                                            form_data.content = req.body.content;
                                            if (body.result == 'ok') {
                                                return res.view('home/threadedit', {
                                                    title: '投稿編集',
                                                    gconfig: common.gconfig,
                                                    form: form_data,
                                                    msg: common.gmsg.result_update_success,
                                                    alert: 'alert-success'
                                                });
                                            } else {
                                                if (body.errors.title !== undefined)
                                                    form_data.titlemsg = body.errors.title.msg;
                                                if (body.errors.content !== undefined)
                                                    form_data.contentmsg = body.errors.content.msg;
                                                return res.view('home/threadedit', {
                                                    title: '投稿編集',
                                                    gconfig: common.gconfig,
                                                    form: form_data,
                                                    msg: common.gmsg.result_update_failure,
                                                    alert: 'alert-danger'
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    return res.forbidden();
                                }
                            } else
                                return res.forbidden();
                        });
                        break;
                    case 'destory':
                        common.gapi.get(common.gconfig.site.api.thread.findBynid + '/' + nid, function (err, response, body) {
                            if (body.result == 'ok') {
                                if (body.thread.uid._id == req.session.osser.uid) {
                                    common.gapi.post(common.gconfig.site.api.thread.destory + '/' + body.thread._id, {
                                        uid: req.session.osser.uid
                                    }, function (err, response, body) {
                                        if (err) next(err);
                                        else {
                                            if (body.result == 'ok') {
                                                return res.redirect(common.gconfig.site.nodejs.route.user + '/' + req.session.osser.myurl);
                                            } else {
                                                return res.forbidden();
                                            }
                                        }
                                    });
                                } else {
                                    return res.forbidden();
                                }
                            } else
                                return res.forbidden();
                        });
                        break;
                    case 'preview':
                        req.flash('title', req.body.title);
                        req.flash('summary', req.body.summary);
                        req.flash('content', req.body.content);
                        req.flash('goback', req.url);
                        return res.redirect(common.gconfig.site.nodejs.route.threadpreview);
                        break;
                    default:
                        return res.forbidden();
                        break;
                    }
                    break;
                default:
                    return res.forbidden();
                    break;
                }
            } catch (e) {
                return res.forbidden();
            }
        } else
            return res.forbidden();
    },

    mydraft: function (req, res) {
        var form_data = {};
        form_data = req.session.osser;
        common.gapi.post(common.gconfig.site.api.thread.search, {
            uid: req.session.osser.uid,
            status: '下書き'
        }, function (err, response, body) {
            if (err) next(err);
            else {
                //console.log(body);
                if (body.result == 'ok') {
                    form_data.threadlist = {
                        threads: body.threads,
                        actionurl: common.gconfig.site.nodejs.route.threadedit
                    }
                    return res.view('home/threadmydraft', {
                        title: '私の下書き',
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

    mylist: function (req, res) {
        var pageindex = req.param('id');
        if (pageindex === undefined)
            pageindex = 1;
        var form_data = {};
        //form_data = common.gfunc.setSSOLoginResult(req.session.osser);
        form_data = req.session.osser;
        common.gapi.post(common.gconfig.site.api.thread.search, {
            uid: req.session.osser.uid,
            status: '公開',
            limit: common.gconfig.pagesize,
            skip: (pageindex - 1) * common.gconfig.pagesize
        }, function (err, response, body) {
            if (err) next(err);
            else {
                if (body.result == 'ok') {
                    form_data.threadlist = {
                        threads: body.threads,
                        actionurl: common.gconfig.site.nodejs.route.threadedit
                    }
                    form_data.pager = common.gfunc.getpager(body.count, pageindex);
                    form_data.pager.actionurl = common.gconfig.site.nodejs.route.threadmylist;
                    form_data.pager.activeindex = pageindex;
                    //console.log(form_data.pager);
                    return res.view('home/threadmylist', {
                        title: '私の投稿',
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

    myanswer: function (req, res) {
        var pageindex = req.param('id');
        if (pageindex === undefined)
            pageindex = 1;
        var form_data = {};
        form_data = req.session.osser;
        common.gapi.post(common.gconfig.site.api.thread.searchFromComment, {
            uid: req.session.osser.uid,
            status: '公開',
            limit: common.gconfig.pagesize,
            skip: (pageindex - 1) * common.gconfig.pagesize
        }, function (err, response, body) {
            if (err) next(err);
            else {
                if (body.result == 'ok') {
                    form_data.threadlist = {
                        threads: body.threads,
                        actionurl: common.gconfig.site.nodejs.route.thread
                    }
                    form_data.pager = common.gfunc.getpager(body.count, pageindex);
                    form_data.pager.actionurl = common.gconfig.site.nodejs.route.threadmyanswer;
                    form_data.pager.activeindex = pageindex;
                    //console.log(form_data.pager);
                    return res.view('home/threadmyanswer', {
                        title: '私の回答',
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
     * (specific to ThreadController)
     */
    _config: {}


};

function abc(content) {
    return common.gfunc.encrypt(content, common.gconfig.secret_key);
}

function cba(content) {
    return common.gfunc.decrypt(content, common.gconfig.secret_key);
}

function addExperience(experience_point, req) {
    common.gapi.post(common.gconfig.site.api.user.addExperience + '/' + req.session.osser.uid, {
        experience: experience_point
    }, function (err1, response1, body1) {
        if (err1) console.error(err1);
    });
}


