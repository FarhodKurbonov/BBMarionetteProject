var mongoose= require('libs/mongoose'),
  log     = require('libs/log.js')(module),
  Schema  = mongoose.Schema,
  async   = require('async'),
  util    = require('util'),
  http    = require('http'),
  ObjectID = require('mongodb').ObjectID,
  Letter   = require('models/letter').Letter;
  Track   = require('models/track').Track;



/**
 * Validation name of artist
 * @param {String} val Value of name
 * @returns {boolean}
 */
function validatorName(val) {
  return val != ''
}
/**
 *
 * @param {Object.<Date>} val
 * @returns {String} Formatted Date
 */
function isoDate(val) {
  if (!val) return val;
  return (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
}

var msgtName = [validatorName, 'не может быть пустым'];

var schema  = new Schema({
  name: {
    type: String,
    required: true,
    validate: msgtName,
    trim: true
  },
  letterId: {
    type: Schema.Types.ObjectId,
    ref: 'Letter'
  },
  createdAt: {
    type: Date,
    get : isoDate
  },
  avatar: {
    type: String
  }

}, {
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret, options) {
    }
  },

  toObject: {
    virtuals: true
  }
});

/*schema.statics.create = function(data, callback) {
  var Contact = this;
  var newContact = new Contact(data);
  newContact.save(function(err, result) {
    if(err) return callback(err);
    //result = result.map(function (contact) {
    var cont =  result.toObject();
    //});
    return callback(null, cont)
  })
};*/

schema.statics.fetch = function(data, callback) {
  var Artist = this;
  if(data[0]){
    data = data[0];
  }
  if(data.parentID) {
    Letter.find({letter: data.parentID}).exec(function(err, result) {
      if(err) return callback(err);
      result = result[0].toObject();
      Artist.find({letterId: result._id}).exec(function(err, result) {
        if(err) return callback(err);
        result = result.map(function (contact) {
          var cont =  contact.toObject();
          return cont;
        });
          return callback(err, result);
      })
    });
  } else {
    Artist.find({}).exec(function(err, result){
      result = result.map(function (contact) {
        var cont =  contact.toObject();
        return cont;
      });
      callback(err, result);
    });
  }
};


schema.statics.deleteArtist = function(data, callback) {
  var Artist = this;
  Track.remove({artistId: data.id}, function(err, result) {
      if(err) return callback(err);
      Artist.findByIdAndRemove(data.id, function(err, result) {
        if(err) return callback(err);
        var art =  result.toObject();
        return callback(null, art)
      })
  });
};
/*
schema.statics.update = function(data, callback) {
  var Contact = this;

  Contact.findById(data.id, function(err, result) {
    if(data.relation) {
      result.acquaintances.push( new ObjectID(data.acquaintedID) );
      result.save(function(err, contact) {
        if(err) return callback(err, oldEntity);
        var cont =  contact.toObject();
        return callback(null, cont)
      });
    }
    //Сохраняем значение до изменения
    //если произойдеть ошибка то вернуть последнее сохраненное
    //значение из базы

    //Сохраняем

    var oldEntity = result.toObject();

    //Обновляем
    result.firstName= data.firstName;
    result.lastName = data.lastName;
    result.phone = data.phone;
    result.save(function(err, contact) {
      if(err) return callback(err, oldEntity);
      var cont =  contact.toObject();
      return callback(null, cont)
    });

  })
};
;*/

exports.Artist = mongoose.model('Artist', schema);
exports.ArtistError = ArtistError;

function ArtistError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, ArtistError);
  this.message = message
}

util.inherits(ArtistError, Error);
ArtistError.prototype.name = 'ArtistError';
