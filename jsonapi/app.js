// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);

console.log(new Date().toString());