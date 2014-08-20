var nconf = require('nconf');

nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({ file: __dirname+'/config.json' });

module.exports = nconf;