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

  },
  createdAt: {
    type: Date,
    get : isoDate,
    default: Date.now
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

schema.statics.create = function(data, callback) {
  var Artist = this;
  var firstLetter = data.name.charAt(0).toLowerCase();
  Letter.find({letter: firstLetter}).exec(function(err, result) {
    if(err) return callback(err);
    result = result[0].toObject();
    data.letterId = result.id;
    Artist.find({name: data.name}).exec(function(err, result) {
      if(err) callback(err);
      if(result.length == 0){
        var newArtist = new Artist(data);
        newArtist.save(function(err, result) {
          if(err) return callback(err);
          var art =  result.toObject();
          return callback(null, art)
        })
      } else {
        callback(new ArtistError('Такой артист уже существует'))
      }
    })
  });
};

schema.statics.fetch = function(data, callback) {
  var Artist = this;
  if(data[0]){
    data = data[0];
  }
  if(data.parentID) {
    Letter.find({letter: data.parentID}).exec(function(err, letter) {
      if(err) return callback(err);
      letter = letter[0].toObject();
      Artist.find({letterId: letter._id}).exec(function(err, artists) {
        if(err) return callback(err);

        artists = artists.map(function (artist) {
          var art =  artist.toObject();
          return art;
        });
        function tracksInArtist(artist, callback){
          Track.count({artistId: artist._id}, function(err, count) {
            artist.count = count;
            artist.letter = artist.name.charAt(0)
            return callback(null, artist);
          });


        }
        async.map(artists, tracksInArtist, function(err, results) {
          return callback(err, results);
        });

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

schema.statics.update = function(data, callback) {
  var Artist = this;
  Artist.findById(data.id, function(err, result) {
    //Сохраняем значение до изменения
    //если произойдеть ошибка то вернуть последнее сохраненное
    //значение из базы

    //Сохраняем

    var oldEntity = result.toObject();

    //Обновляем
    result.name= data.name;
    result.avatar = data.avatar;
    result.save(function(err, artist) {
      if(err) return callback(err, oldEntity);
      var art =  artist.toObject();
      return callback(null, art);
    });

  })
};

exports.Artist = mongoose.model('Artist', schema);
exports.ArtistError = ArtistError;

function ArtistError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, ArtistError);
  this.message = message
}

util.inherits(ArtistError, Error);
ArtistError.prototype.name = 'ArtistError';
