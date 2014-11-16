var mongoose = require('libs/mongoose'),
    fs       = require('fs'),
    log      = require('libs/log.js')(module),
    Schema   = mongoose.Schema,
    async    = require('async'),
    util     = require('util'),
    http     = require('http'),
    probe    = require('node-ffprobe'),
    glob     = require('glob'),
    clearString = require('libs/clearString.js').clearString,
    ObjectID = require('mongodb').ObjectID,
    DOWNLOAD = 'mp3/';

//==============Validate=====================
  /**
   * Validation name of track
   * @param {String} val Value of name
   * @returns {boolean}
   */
  function validateTrackName(val) {
    return (val != '' && val.length > 2)
  }
  /**
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

  //Custom error messages
  var msgTrackName = [validateTrackName, 'не может быть пустым'];
  var msgTrackUrl = [];
  var quality = ['аранжировка', 'задавка', 'нарезка', 'оригинал'];
  var fonoType = ['caraoke', 'guitar', 'saxophone', 'percussion'];


//=================Model=======================

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
      type: String,
      enum: fonoType
    },
    quality: {
      type: String,
      enum: quality
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


//=====Handle all work with track entities=====

  //save data when creates new track entity
  schema.statics.saveData =  function(data, cb){
    var Track = this;
    probe(DOWNLOAD+data.trackName, function(err, probeData) {
      if(err)
        return cb( new TrackError('Произошла ошибка при сохранении трека Попоробуйте пересохранить') );

      //Проверка на нулевой байт
      if(~data.name.indexOf('\0')) return cb( new TrackError('Если хочешь хакерничать иди на другой ресурс!!') );

      var newTrack = new Track();
      newTrack.name = clearString(data.name, 20) || "";//Взяли имя
      newTrack.artistId = data.artistId;
      newTrack.url.urlM = probeData.file;
      newTrack.bitRate = probeData.format.bit_rate;
      //newTrack.uploadUserId = '';//Пока оставим пустым
      newTrack.likeVSdislike = '';//Пока оставим пустым
      newTrack.duration = probeData.format.duration;//Пока оставим пустым
      newTrack.size = probeData.format.size/1048576;
      //newTrack.Pl_UserId = '';//Пока оставим пустым
      newTrack.listenCount = '';//Пока оставим пустым
      newTrack.fonogrammType = data.type;
      newTrack.quality = data.quality;
      newTrack.vocal = data.vocal;
      newTrack.songText = clearString(data.songText, 1000) ;
      newTrack.youTubeLink = clearString(data.youTubeLink, 256);
      newTrack.save(function(err, result) {
        if(err) return cb(err);
        var track =  result.toObject();
        return cb(null, track)
      });
    });
  };
  //update exist track entity
  schema.statics.updateData =  function(data, oldEntity, cursor, cb) {

    probe(DOWNLOAD+data.trackName, function(err, probeData) {
      if(err)
        return cb(new TrackError('Произошла ошибка при сохранении трека Попоробуйте пересохранить'), oldEntity);

      cursor.name = data.name || "";//Взяли имя
      cursor.artistId = data.artistId;
      cursor.url.urlM = probeData.file;
      cursor.bitRate = probeData.format.bit_rate;
      //newTrack.uploadUserId = '';//Пока оставим пустым
      cursor.likeVSdislike = '';//Пока оставим пустым
      cursor.duration = probeData.format.duration;//Пока оставим пустым
      cursor.size = probeData.format.size/1048576;
      //newTrack.Pl_UserId = '';//Пока оставим пустым
      cursor.listenCount = '';//Пока оставим пустым
      cursor.fonogrammType = data.type;
      cursor.quality = data.quality;
      cursor.vocal = data.vocal;
      cursor.songText = data.songText;
      cursor.youTubeLink = data.youTubeLink;
      cursor.save(function(err, result) {
        if(err) return cb(err, oldEntity);
        var track =  result.toObject();
        return cb(null, track)
      });
    });

  };

  schema.statics.create = function(data, callback) {
    var Track = this;
    Track.saveData(data, callback);
  };

  schema.statics.update = function(data, cb) {
    var Track = this;

    async.waterfall([
      //Делаем запрос к базе
      function(callback) {
        Track.findById(data.id, function(err, cursor) {
          var oldEntity = cursor.toObject();
        //если не нашли такую запись то генерим ошибку trackError
        // и передаем управление последнему коллбеку
        if(err) return callback(new TrackError('Не удалось найти такую запись. Удалите этот трек и заново добавте'), oldEntity);
          //если запрос прошел удачно то передаем управление следующей функции
         callback(null, oldEntity, cursor);
        });
      },
      //Если запрос был на замену нового трека...
      function(oldEntity, cursor, callback) {
          var pattern = oldEntity.url.urlM;
          glob(pattern, {mark: true, sync:true}, function(err, files) {

              //Если не нашли старый(нечаянно удалили)
              if(err||files.length==0) {
                //то генерим ошибку trackError
                var error = new TrackError('Не удалось найти предыдущий трек. Удалите эту минусовки и добавить заново');
                return callback(error, oldEntity);
              }
              //Если  запрос на замену новоого файла найденный старый удаляем
              if(data.reload){
                fs.unlinkSync(files[0]);
                return callback(new Error('Complete Task'), oldEntity, cursor);
              }
            //Иначе передаем управление дальше
              return callback(null, oldEntity, cursor);
          });
      },
      //Если запрос на просто изменен имени файла
      function(oldEntity, cursor, callback) {
        if(oldEntity.url.urlM != DOWNLOAD+data.trackName){
          fs.renameSync(oldEntity.url.urlM, DOWNLOAD+data.trackName);
          return callback(new Error('Complete Task'), oldEntity, cursor);
        }
        //Если нет то передаем управление дальше
        return callback(new Error('Complete Task'), oldEntity, cursor);
      }
    ], function (err, oldEntity, cursor) {
        if(err.name == 'TrackError')
          return cb(err, oldEntity);
        return Track.updateData(data, oldEntity, cursor, cb)

    });
  /*
    Track.findById(data.id, function(err, result) {

      //Сохраняем значение до изменения если произойдеть ошибка
      // то вернуть последнее сохраненное значение из базы
      var oldEntity = result.toObject();

      //Если прикреплен новый файл
      if(data.reload){
      //Находим старый файл
      var pattern = oldEntity.url.urlM;
      glob(pattern, {mark: true}, function(err, files) {
        log.info(pattern);
        //Если не находим такой файл
        if( err || files.length == 0 ) {
          var error = new TrackError('Невозможно найти предыдущий трек. Попробуйте удалить эту минусовки и добавить заново');
          return callback(error, oldEntity);
        } else {
          //Удаляем
          fs.unlink(files[0], function(err) {
            if(err) return callback(err, oldEntity);
          });
         return Track.updateData({
           result: result,
           data  : data,
           oldEntity: oldEntity,
           callback: callback
         });
        }
      });
      //Иначе(просто изменен имя файла)
      } else {
        if(oldEntity.url.urlM == DOWNLOAD+data.trackName)
          return  Track.updateData(data, oldEntity, callback);
      //Если просто  ереименовываем файл
        fs.rename(oldEntity.url.urlM, DOWNLOAD+data.trackName, function(err) {
          if(err) {
            var error = new TrackError('Невозможно переименовать трек. Попробуйте удалить эту минусовки и добавить заново');
            return callback(error, oldEntity);
          } else {
          return  Track.updateData(data, oldEntity, callback);
          }
        });
      }


    })*/
  };
  //Query for all track entities
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
  //Query for delete one track entity
  schema.statics.deleteTrack = function(data, callback) {
    var Track = this;

      Track.findByIdAndRemove(data.id, function(err, result) {
        if(err) return callback(err);
        var trk =  result.toObject();
        return callback(null, trk)
      })

  };

  schema.statics.downloadTrack =  function(trackId, callback) {
    var Track = this;
    Track.find({id: trackId}).exec(function(err, result) {
      if(err) return callback(err);
      var trk =  result[0].toObject();
      return callback(null, trk.url.urlM);
    });
  };

//Export our module
exports.Track = mongoose.model('Track', schema);
exports.TrackError = TrackError;

//Our custom Error Object
function TrackError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, TrackError);
  this.message = message
}

util.inherits(TrackError, Error);
TrackError.prototype.name = 'TrackError';
