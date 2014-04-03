var common = require('../../../common');

module.exports = function (req, res, next) {
    var myurl = req.param('id');
    common.gapi.get(common.gconfig.site.api.user.findByMyurl + '/' + myurl, function (err, response, body) {
        if (body.result === 'ok') {
            common.gapi.post(common.gconfig.site.api.thread.search, {
                uid: body.user._id,
                status: '公開',
                limit: 10,
                offset: 0
            }, function (err, response, body) {
                if (err) next();
                else {
                    if (body.result == 'ok') {
                        if (body.threads.length > 0) {
                            req.flash('mythreads', body.threads);
                        } else {
                            req.flash('mythreads', null);
                        }
                        next();
                    } else {
                        req.flash('mythreads', null);
                        next();
                    }
                }
            });
        } else {
            req.flash('mythreads', null);
            next();
        }
    });
};