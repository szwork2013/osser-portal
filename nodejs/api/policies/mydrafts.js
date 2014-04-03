var common = require('../../../common');

module.exports = function (req, res, next) {
    if (req.session.osser) {
        common.gapi.post(common.gconfig.site.api.thread.search, {
            uid: req.session.osser.uid,
            status: '下書き',
            limit: 10,
            offset: 0
        }, function (err, response, body) {
            if (err) next();
            else {
                if (body.result == 'ok') {
                    //req.flash('mydrafts', []);にすると、エラー発生（connection-flashバグ）
                    if (body.threads.length > 0)
                        req.flash('mydrafts', body.threads);
                    else
                        req.flash('mydrafts', null);
                    next();
                } else {
                    req.flash('mydrafts', null);
                    next();
                }
            }
        });
    } else {
        req.flash('mydrafts', null);
        next();
    }
};

