/*
 * nodemailer:
 * https://github.com/andris9/Nodemailer
 */
var nodemailer = require('nodemailer');
var gconfig = require('./gconfig').config;

exports.sendmailBySSL = sendmailBySSL;

function sendmailBySSL(msg) {
    var transport = nodemailer.createTransport('SMTP', {
        host: gconfig.mail_opts.host,
        secureConnection: true,
        port: gconfig.mail_opts.port_ssl,
        auth: {
            user: gconfig.mail_opts.auth.user,
            pass: gconfig.mail_opts.auth.pass
        }
    });

    console.log('送信開始:' + JSON.stringify(msg));

    transport.sendMail(msg, function (error) {
        if (error) {
            console.error(error);
            console.log('送信失敗.' + JSON.stringify(error));
        } else {
            console.log('送信終了.');
        }
        msg.transport.close();
    });
}

exports.sendmail = sendmail;

function sendmail(msg) {
    var transport = nodemailer.createTransport('SMTP', {
        host: gconfig.mail_opts.host,
        port: gconfig.mail_opts.port,
        secureConnection: false,
        auth: {
            user: gconfig.mail_opts.auth.user,
            pass: gconfig.mail_opts.auth.pass
        }
    });

    console.log('送信開始:' + JSON.stringify(msg));

    transport.sendMail(msg, function (error) {
        if (error) {
            console.error(error);
            console.log('送信失敗.' + JSON.stringify(error));
        } else {
            console.log('送信終了.');
        }
        msg.transport.close();
    });
}

exports.sendsimplemail = function (to, subject, msg) {
    sendmail({
        from: gconfig.name + ' <' + gconfig.mail_opts.admin_mail + '>',
        to: to,
        bcc: gconfig.mail_opts.admin_mail,
        subject: subject,
        text: msg
    });
};

exports.sendmail_to_admin = function (subject, msg) {
    sendmail({
        from: gconfig.mail_opts.system_mail,
        to: gconfig.mail_opts.admin_mail,
        subject: subject,
        text: msg
    });
};

exports.sendmail_to_admin_cb = function (subject, msg, cb) {
    sendmail_cb({
        from: gconfig.mail_opts.system_mail,
        to: gconfig.mail_opts.admin_mail,
        subject: subject,
        text: msg
    }, cb);
};

exports.sendmail_cb = sendmail_cb;

function sendmail_cb(msg, cb) {
    var transport = nodemailer.createTransport('SMTP', {
        host: gconfig.mail_opts.host,
        port: gconfig.mail_opts.port,
        auth: {
            user: gconfig.mail_opts.auth.user,
            pass: gconfig.mail_opts.auth.pass
        }
    });

    //console.log('送信開始:' + JSON.stringify(msg));

    transport.sendMail(msg, function (error) {
        var mailresult = {};
        if (error) {
            console.error(error);
            mailresult.result = 'fail';
            //console.log('送信失敗.' + JSON.stringify(error));
        } else {
            mailresult.result = 'ok';
            //console.log('送信終了.');
        }
        msg.transport.close();
        cb(mailresult);
    });
}