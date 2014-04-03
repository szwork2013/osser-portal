process.on('uncaughtException', function (err) {
    console.log('-----uncaughtException-----');
    console.error(err);
});

// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);