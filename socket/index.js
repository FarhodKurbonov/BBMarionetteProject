
var config    = require('config'),
  async       = require('async'),
  log         = require('libs/log.js')(module),
  SocketError = require('error'),
  Letter      = require('models/letter').Letter,
  Artist      = require('models/artist').Artist,
  Track       = require('models/track').Track,
  fs          = require('fs'),
  util        = require('util'),
  path        = require('path'),
  Files       = {};

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
      //Сохранить данные в базу Artists
      //Если нет есть ошибки сгенерировать ошибку иначе
      //отправить данные обратно к клиенту(Backbone) via callback
      Artist.create(data, function(err, result){
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
    socket.on('artists:read', function(data, callback) {
      Artist.fetch(data, function(err, result) {
        if(err) {
          return callback(new SocketError(404, 'Not Found artists'));
        } else {
          return callback(null, result)
        }
      });

    });
    socket.on('artists:update', function(artist, callback) {
      //Обновить контакт
      //Отправить обратно the result
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
          //debugger;
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





    //=======Upload Files========
    socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
      var Name = data['Name'];
      Files[Name] = {  //Create a new Entry in The Files Variable
        FileSize : data['Size'],
        Data     : "",
        Downloaded : 0
      };
      var Place = 0;
      try{
        var Stat = fs.statSync('tempFiles/' +  Name);
        if(Stat.isFile()) {
          Files[Name]['Downloaded'] = Stat.size;
          Place = Stat.size / 524288;
        }
      } catch(er) {
        //It's a New File
      }
      fs.open('tempFiles/' + Name, "a", 0755, function(err, fd) {
        if(err) {
          console.log(err);
        } else {
          Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
          socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
        }
      });
    });

    socket.on('Upload', function (data) {
      var Name = data['Name'];
      Files[Name]['Downloaded'] += data['Data'].length;
      Files[Name]['Data'] += data['Data'];
      if( Files[Name]['Downloaded'] == Files[Name]['FileSize'] ) {//If File is Fully Uploaded

        fs.write( Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen) {
          var inp = fs.createReadStream('tempFiles/' + Name);
          var out = fs.createWriteStream('mp3/' + Name);
          inp.pipe(out);
          out.on('close', function(err, arg) {
            if(err) log.error(err)
            fs.unlink( 'tempFiles/' + Name, function (err) { //This Deletes The Temporary File
              if(err) log.error(err);
              socket.emit('Done', {'trackName': Name});
            });
          });
        })
      } else if( Files[Name]['Data'].length > 10485760 ){ //If the Data Buffer reaches 10MB
        fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
          Files[Name]['Data'] = ""; //Reset The Buffer
          var Place = Files[Name]['Downloaded'] / 524288;
          var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
          socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        });
      } else {
        var Place = Files[Name]['Downloaded'] / 524288;
        var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
        socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
      }
    });


  });

  return io
};

