var mongoose= require('libs/mongoose'),
  log     = require('libs/log.js')(module),
  Schema  = mongoose.Schema,
  async   = require('async'),
  util    = require('util'),
  http    = require('http'),
  ObjectID = require('mongodb').ObjectID;

/**
 * Буква каталога
 * @type {Schema}
 */
var schema  = new Schema( {letter: { type: String} },
                          {
                            versionKey: false,
                            toJSON: {
                              virtuals: true,
                              transform: function(doc, ret, options) {
                                //ret.id = ret._id.toHexString();
                              }
                            },
                            toObject: {
                              virtuals: true
                            }
                          });
/**
 *
 * @param data Буква для добавления в каталог
 * @param callback  Коллбэк функция которой передается результат запроса
 */
schema.statics.create = function(data, callback) {
  var Letter = this;
  var newLetter = new Letter(data);
  Letter.save(function(err, result) {
    if(err) return callback(err);

    var cont =  result.toObject();

    return callback(null, cont)
  })
};
/**
 * Запрос всех  английских и русских букв алфавита, а также цифр от 0-9
 * @param {({id: string})|null}  data Содержит id буквы когда
 *                               идет запрос по определенной букве
 *                               или null при запросе всех букв
 * @param callback  Коллбэк функция которой передается результат запроса
 * @protected
 */
schema.statics.fetch = function(data, callback) {
  var Letter = this;

    Letter.find({}).exec(function(err, result){
      result = result.map(function (contact) {
        var cont =  contact.toObject();
        return cont;
      });
      return callback(err, result);
    });


};
/**
 * Запрос на обновление буквы
 * @param {{id: string, letter: string}}  data Содержит id буквы, letter- Новое значение
 * @param callback  Коллбэк функция которой передается результат запроса
 * @protected
 */
schema.statics.update = function(data, callback) {
  var Letter = this;

  Letter.findById(data.id, function(err, result) {
    //Сохраняем значение до изменения если произойдёт ошибка то вернуть последнее сохраненное значение из базы
    var oldEntity = result.toObject();
    //Обновляем
    result.letter= data.letter;
    result.save(function(err, contact) {
      if(err) return callback(err, oldEntity);
      var cont =  contact.toObject();
      return callback(null, cont)
    });

  })
};

/**
 * Запрос на удаление буквы
 * @param {{id: string}} data Содержит id удаляемо буквы
 * @param callback  Коллбэк функция которой передается результат запроса
 * @protected
 */
schema.statics.deleteContact = function(data, callback) {
  var Letter = this;

  Contact.findByIdAndRemove(data.id, function(err, result) {
    if(err) return callback(err);
    var cont =  result.toObject();
    return callback(null, cont)
  })
};

exports.Letter = mongoose.model('Letter', schema);
exports.LetterError = LetterError;

function LetterError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, ContactError);
  this.message = message
}

util.inherits(LetterError, Error);
LetterError.prototype.name = 'LetterError';
