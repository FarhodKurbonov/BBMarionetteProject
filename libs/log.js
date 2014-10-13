var winston = require('winston');
var ENV = process.env.NODE_ENV;

/**
 * Логгер с двумя транспортами: Файл и консоль
 * @param module Имя модуля которого необзодимо логгировать
 * @returns {Object} Возваряет логгер
 */

function getLogger(module) {

  var path = module.filename.split('/').slice(-2).join('/');

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: (ENV == 'development') ? 'debug' : 'error',
        label: path
      }),
      new winston.transports.File({
        filename: 'logs/debug.log',
        level: (ENV == 'development') ? 'debug' : 'error'
      })
    ]
  });
}

module.exports = getLogger;