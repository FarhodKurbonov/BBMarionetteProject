
var config    = require('config'),
  async       = require('async'),
  log         = require('libs/log.js')(module),
  SocketError = require('error'),
  Letter      = require('models/letter').Letter,
  Artist      = require('models/artist').Artist,
  Track       = require('models/track').Track,
  fs          = require('fs'),
  crypto      = require('crypto'),
  path        = require('path'),
  ss          = require('socket.io-stream'),
  exec        = require('child_process').exec,
  probe       = require('node-ffprobe'),
  translit    = require('translitit-cyrillic-russian-to-latin/lib/translitit-cyrillic-russian-to-latin'),
  clearString = require('libs/clearString.js').clearString,
  Uploader    = require('libs/uploader').uploader,
  DOWNLOAD    = 'mp3/',
  TEMP        = 'temp/';

module.exports = function(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {

    //=================Letters==================================
    socket.on('letters:read', function(data, callback) {
      Letter.fetch(data, function(err, result) {
        if(err) {
          return callback(new SocketError(404, 'Not Found this letter'));
        } else {
          return callback(null, result);
        }
      })
    });

    //==================CRUD Artist==============================
    socket.on('artists:create', function (data, callback) {
      /**
       * Сохранить данные в базу Artists. Если есть ошибки сгенерировать ошибку иначе
       * отправить данные обратно пользователю
       */
      Artist.create(data, function(err, result){
        if(err) {
          var error = {};
          if(err.name === 'MongoError') {
            error.nameError = err.message;
            if(err.errors.name) error.name = err.errors.name.message;
            if(err.errors.avatar) error.avatar = err.errors.name.message;
            return callback({
              status: 422,
              errors: error
            });
          }
          if(err.name === 'ArtistError') {
            error.name = err.message;
            return callback({
              status: 422,
              errors: error
            });
          }
        } else {
          return callback(null, result);
        }
      });
    });
    socket.on('artists:read', function(data, callback) {
      Artist.fetch(data, function(err, result) {
        if(err) {
          return callback({error: err.message});
        } else {
          return callback(null, result)
        }
      });

    });
    socket.on('artists:update', function(artist, callback) {

      Artist.update(artist, function(err, artist){
        if(err) {
          var error = {};
          if(err.name == "MongoError") {
            error.name = err.message;
            return callback({
              status: 422,
              errors: error,
              entity: artist
            });
          }
          if(err.errors.name) error.name = err.errors.name.message;
          if(err.errors.avatar) error.avatar = err.errors.avatar.message;

          return callback({
            status: 422,
            errors: error,
            entity: artist
          });
        } else {
          return callback(null, artist);
        }
      });

    });
    socket.on('artists:delete', function(artist, callback) {
      //Удаляем контакт
      //Отправить обратно the result
      Artist.deleteArtist(artist, function(err, artist) {

        if(err) {
          return callback(new SocketError(404, err.message));
        }
         return callback(null, artist);
      });
    });

    //===================CRUD Track===============================
    socket.on('tracks:create', function(data, callback){
      //Сохранить данные в базу Artists
      //Если нет есть ошибки сгенерировать ошибку иначе
      //отправить данные обратно к клиенту(Backbone) via callback
      Track.create(data, function(err, result) {
        if(err) {
          var error = {};
          if(err.name === 'MongoError') {
            error.nameError = err.message;
            if(err.errors.name) error.name = err.errors.name.message;
            if(err.errors.avatar) error.avatar =err.errors.name.message;
            return callback({
              status: 422,
              errors: error
            });
          }
          if(err.name === 'ArtistError') {
            error.name = err.message;
            return callback({
              status: 422,
              errors: error
            });
          }
        } else {
          return callback(null, result);
        }
      });
    });
    socket.on('tracks:read', function(data, callback) {
      Track.fetch(data, function(err, result) {
        if(err) {
          return callback(new SocketError(404, 'Not Found tracks'));
        } else {
          return callback(null, result)
        }
      });
    });
    socket.on('tracks:update', function(track, callback) {

      Track.update(track, function(err, track){
        if(err) {
          var error = {};
          if(err.name == "MongoError") {
            if(err.errors.name) error.name = err.errors.name.message;
            return callback({
              status: 422,
              errors: error,
              entity: track
            });
          }
          if(err.name=='TrackError') {
            error.fileName = err.message;
          }
            return callback({
            status: 422,
            errors: error,
            entity: track
          });
        } else {
          return callback(null, track);
        }
      });

    });
    socket.on('tracks:delete', function(artist, callback) {
      //Удаляем контакт
      //Отправить обратно the result
      Track.deleteTrack(artist, function(err, artist) {

        if(err) {
          return callback(new SocketError(404, err.message));
        }
        return callback(null, artist);
      });
    });


    //=======Upload Files========
    ss(socket).on('Upload', function (stream, data) {

      var fullFileName = path.basename(data.Name).split(' ').join('_');
      var hash = crypto.randomBytes(10).toString('hex');
      var spFlName= fullFileName.split('.');
      var fileName = spFlName.slice(0, spFlName.length - 1).join('');
      var extension = spFlName[spFlName.length - 1];

      //=============Some works for correct save file=====================================
      //Проверка на нулевой байт
      if(~fileName.indexOf('\0')) return socket.emit('done', {trackName : fileName, success: false});
      //Очищаем строку от всяких примесей типа html тегов и др
      fileName = clearString(fileName, 10);

      fullFileName = fileName +'_' + hash + '_'+ '.' + extension;
      //Transliteration. Need for cyrillic words
      fullFileName = translit(fullFileName);

      var writeStream = fs.createWriteStream(TEMP+fullFileName);
      stream.pipe(writeStream);
      stream.on('error', function() {
        log.error('error occur in saving process - file: %s', fullFileName);
      });
      stream.on('end', function() {
        //Write to log
        log.info('Success uploaded file in temp/%s, date- %d', fullFileName, new Date);
        log.info('Attempt save file to mp3/: %s', fullFileName);

        var uploader = Uploader.getInstance(fullFileName, socket);
        //Save file
        uploader.saveFile();
      });
    });
  });

  return io
};
