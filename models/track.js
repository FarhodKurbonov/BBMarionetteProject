var mongoose= require('libs/mongoose'),
    log     = require('libs/log.js')(module),
    Schema  = mongoose.Schema,
    async   = require('async'),
    util    = require('util'),
    http    = require('http'),
    ObjectID = require('mongodb').ObjectID;
/**
 * Validation name of track
 * @param {String} val Value of name
 * @returns {boolean}
 */
function validateTrackName(val) {
  return (val != '' && val.length > 2)
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
function validateTrackUrl(val){
  var extend = val.split('.');
  extend = extend[(extend.length-1)];
  return (val != '' && val.length > 2)
}
var msgTrackName = [validateTrackName, 'не может быть пустым'];
var msgTrackUrl = [];
var types = ['аранжировка', 'задавка', 'нарезка', 'оригинал'];
var schema  = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: msgTrackName
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  },
  url: { // urls: urlM-минусовка, urlP-плюсовка, urlT-текст
    urlM: {type: String/*, required: true*/},
    urlP: {type: String/*, required: true*/},
    urlT: {type: String/*, required: true*/}
  },
  createdAt: {
    type: Date,
    get : isoDate
  },
  uploadUserId:{
    type: Schema.Types.ObjectId
  },
  likeVSdislike: {
    up  : {
      count: {type: Number, default: 0 },
      date : {type: Date, default: Date.now}
    },
    down: {
      count: {type: Number, default: 0 },
      date : {type: Date, default: Date.now}
    }
  },
  duration: {
    type: String
  },
  bitRate: {
    type: String
  },
  size: {
    type: String
  },
  downloadCount: {
    type: Number
  },
  Pl_UserId: {
    type: Schema.Types.ObjectId
  },
  listenCount: {
    type: Number
  },
  fonogrammType: {
    caraoke: {
      type: String,
      enum: types
    },
    guitar: {
      type: String,
      enum: types
    },
    saxophone: {
      type: String,
      enum: types
    },
    percussion: {
      type: String,
      enum: types
    }

  },
  vocal: {
    type: Boolean
  },
  songText: {
    type: String
  },
  youTubeLink: {
    type: String
  }

}, {
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

schema.methods.saveTrack = function(data){

};

schema.statics.create = function(data, callback) {
  var Track = this;

  var newTrack = new Track();
  newTrack.name = data.name || "";//Взяли имя
  newTrack.artistId = data.artistId;
  newTrack.url.urlM = '/mp3/' + data.trackName;
  newTrack.bitRate = '';//Пока оставим пустым
  //newTrack.uploadUserId = '';//Пока оставим пустым
  newTrack.likeVSdislike = '';//Пока оставим пустым
  newTrack.duration = '';//Пока оставим пустым
  newTrack.size = '';//Пока оставим пустым
  //newTrack.Pl_UserId = '';//Пока оставим пустым
  newTrack.listenCount = '';//Пока оставим пустым
  newTrack.fonogrammType[data.type] = data.quality;
  newTrack.vocal = data.vocal;
  newTrack.songText = data.songText;
  newTrack.youTubeLink = data.youTubeLink;
  newTrack.save(function(err, result) {
    if(err) return callback(err);
    var track =  result.toObject();
    return callback(null, track)
  });

};

schema.statics.update = function(data, callback) {
  var Track = this;
  Track.findById(data.id, function(err, result) {
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

schema.statics.fetch = function(data, callback) {
  var Track = this;
  if(data[0]){
    data = data[0];
  }
  if(data.parentID) {
    Track.find({artistId: data.parentID}).exec(function(err, tracks) {
      if(err) return callback(err);

      tracks = tracks.map(function (track) {
        var trk =  track.toObject();
        return trk;
      });
        return callback(err, tracks);
      })

  } else {
    Track.find({id: data.id}).exec(function(err, result) {
      if(err) callback(err);
      result = result.map(function (track) {
        var trk =  track.toObject();
        return trk;
      });
        return callback(err, result)
    });
  }
};

/*schema.statics.update = function(data, callback) {
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
};*/

/*schema.statics.deleteContact = function(data, callback) {
  var Contact = this;
  if(data.relation) {

    Contact.findByIdAndUpdate(data.id, { $pull: {acquaintances: new ObjectID(data.acquaintedID)} }, function(err, result) {
      if(err) return callback(err);
      var cont =  result.toObject();
      return callback(null, cont)

    });
  }

  Contact.findByIdAndRemove(data.id, function(err, result) {
    if(err) return callback(err);
    var cont =  result.toObject();
    return callback(null, cont)
  })
};*/

exports.Track = mongoose.model('Track', schema);
exports.TrackError = TrackError;

function TrackError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, TrackError);
  this.message = message
}

util.inherits(TrackError, Error);
TrackError.prototype.name = 'ContactError';
