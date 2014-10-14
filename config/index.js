var nconf = require('nconf');
var path = require('path');
/**
 * Настройки конфигурации находятся в файле config.json
 */
nconf.argv()
  .env()
  .file({ file: path.join(__dirname,'config.json') });
module.exports = nconf;