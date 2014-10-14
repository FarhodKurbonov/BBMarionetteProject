var mongoose = require('mongoose');
var config   = require('config');
/**
 * Подключяет mongoose к БД mongoDB
 */
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'), function() {

});
module.exports = mongoose;