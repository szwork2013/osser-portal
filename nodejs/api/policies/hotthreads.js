var common = require('../../../common');

module.exports = function (req, res, next) {
    common.gapi.post(common.gconfig.site.api.thread.search, {
        status: '公開',
        limit: 7,
        skip: 0,
        sortOptions: {
            visitedcount: -1
        }
    }, function (err, response, body) {
        if (err) next();
        else {
            if (body.result == 'ok') {
                if (body.threads.length > 0)
                    req.flash('hotthreads', body.threads);
                else
                    req.flash('hotthreads', null);
                next();
            } else {
                req.flash('hotthreads', null);
                next();
            }
        }
    });
};