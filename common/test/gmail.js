var common = require('../index.js');
var local = require('../local.js');

describe('gmail', function () {
    it('testmail', function (done) {
        common.gmail.sendmail_to_admin_cb('test mail for new smtp server', 'new test mail content.', function (result) {
            console.log(result);
            done();
        });
    });
});