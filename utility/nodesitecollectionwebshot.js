#! /usr/bin/env node

var webshot = require('webshot');
var async = require('async');
var program = require('commander');
var gm = require('gm');

program
    .version('0.1.0')
    .option('-o, --out [out]', '出力フォルダを指定');

program.on('--help', function () {
    console.log('======================');
    console.log('使用例：');
    console.log('./nodesitecollectionwebshot.js -o /tmp');
    console.log('======================');
});

program.parse(process.argv);

var sitelist = [
    {
        name: 'nodejs',
        url: 'http://nodejs.org/'
    },
    {
        name: 'npm',
        url: 'https://www.npmjs.org/'
    },
    {
        name: 'meteor',
        url: 'https://www.meteor.com/'
    },
    {
        name: 'cloud9-ide',
        url: 'https://c9.io/'
    },
    {
        name: 'expressjs',
        url: 'http://expressjs.com/'
    },
    {
        name: 'nodejitsu',
        url: 'https://www.nodejitsu.com/'
    },
    {
        name: 'how-to-node',
        url: 'http://howtonode.org/'
    },
    {
        name: 'socket.io',
        url: 'http://socket.io/'
    },
    {
        name: 'mongoose',
        url: 'http://mongoosejs.com/'
    },
    {
        name: 'the-node-beginner-book',
        url: 'http://www.nodebeginner.org/'
    },
    {
        name: 'jade',
        url: 'http://jade-lang.com/'
    },
    {
        name: 'sails.js',
        url: 'http://sailsjs.org/'
    },
    {
        name: 'modulus',
        url: 'https://modulus.io/'
    },
    {
        name: 'passport',
        url: 'http://passportjs.org/'
    },
    {
        name: 'nodejs-guide',
        url: 'http://nodeguide.com/'
    },
    {
        name: 'keystonejs',
        url: 'http://keystonejs.com/'
    },
    {
        name: 'node-school',
        url: 'http://nodeschool.io/'
    },
    {
        name: 'nodebb',
        url: 'https://nodebb.org/'
    },
    {
        name: 'koa',
        url: 'http://koajs.com/'
    },
    {
        name: 'sequelize',
        url: 'http://sequelizejs.com/'
    },
    {
        name: 'node-tuts',
        url: 'http://nodetuts.com/'
    },
    {
        name: 'echo-js',
        url: 'http://www.echojs.com/'
    },
    {
        name: 'nodejs-knockout',
        url: 'http://nodeknockout.com/'
    },
    {
        name: 'chai',
        url: 'http://chaijs.com/'
    },
    {
        name: 'nodetime',
        url: 'http://nodetime.com/'
    },
    {
        name: 'docpad',
        url: 'http://docpad.org/'
    },
    {
        name: 'geddy',
        url: 'http://geddyjs.org/'
    },
    {
        name: 'nodecopter',
        url: 'http://nodecopter.com/'
    },
    {
        name: 'compoundjs',
        url: 'http://compoundjs.com/'
    },
    {
        name: 'locomotive',
        url: 'http://locomotivejs.org/'
    },
    {
        name: 'node-db',
        url: 'http://nodejsdb.org/'
    },
    {
        name: 'david',
        url: 'https://david-dm.org/'
    },
    {
        name: 'harp',
        url: 'http://harpjs.com/'
    },
    {
        name: 'hispano',
        url: 'http://www.nodehispano.com/'
    },
    {
        name: 'socketstream',
        url: 'http://socketstream.org/'
    },
    {
        name: 'nodejs-brazil',
        url: 'http://nodebr.com/'
    },
    {
        name: 'flatiron',
        url: 'flatironjs.org'
    },
    {
        name: 'jsappus',
        url: 'http://jsapp.us/'
    },
    {
        name: 'logio',
        url: 'http://logio.org/'
    },
    {
        name: 'cloudnode',
        url: 'http://cloudno.de/'
    },
    {
        name: 'wintersmith',
        url: 'http://wintersmith.io/'
    },
    {
        name: 'pdfkit',
        url: 'http://pdfkit.org/'
    },
    {
        name: 'nodeup',
        url: 'http://nodeup.com/'
    },
    {
        name: 'nodebots',
        url: 'http://nodebots.io/'
    },
    {
        name: 'qlio',
        url: 'http://ql.io/'
    },
    {
        name: 'vows',
        url: 'http://vowsjs.org/'
    },
    {
        name: 'nodeconf',
        url: 'http://nodeconf.com/'
    },
    {
        name: 'node-summit',
        url: 'http://nodesummit.com/'
    },
    {
        name: 'node-security-project',
        url: 'https://nodesecurity.io/'
    },
    {
        name: 'nombo',
        url: 'http://nombo.io/'
    },
    {
        name: 'nodejs-conference',
        url: 'http://nodejsconf.it/'
    },
    {
        name: 'ldapjs',
        url: 'http://ldapjs.org/'
    },
    {
        name: 'riak-js',
        url: 'http://riakjs.com/'
    },
    {
        name: 'hexo',
        url: 'http://hexo.io/'
    },
    {
        name: 'highland',
        url: 'http://highlandjs.org/'
    },
    {
        name: 'turtle-io',
        url: 'http://turtle.io/'
    },
    {
        name: 'ect',
        url: 'http://ectjs.com/'
    },
    {
        name: 'nodecasts',
        url: 'http://nodecasts.net/'
    },
    {
        name: 'npmjs-eu',
        url: 'http://npmjs.eu/'
    },
    {
        name: 'spludo',
        url: 'http://spludo.com/'
    },
    {
        name: '',
        url: ''
    }
];

var options = {
    //    screenSize: {
    //        width: 320,
    //        height: 480
    //    },
    //    shotSize: {
    //        width: 240,
    //        height: 'all'
    //    },
    userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
}

if (program.out) {
    async.each(sitelist, function (item, done) {
        if (item.name === 'nodejs') {
            var out_image = program.out + '/' + item.name + '.png';
            webshot(item.url, out_image, function (err) {
                console.log(item, out_image, 'ok');
                // フォルダにflickr.pngファイルを保存された
                if (err) console.error(err);
                done();
            });
        } else
            done();
    }, function (err) {
        if (err) console.error(err);
    });
} else {
    program.help();
}