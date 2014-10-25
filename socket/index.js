
var config    = require('config'),
  async       = require('async'),
  log         = require('libs/log.js')(module),
  SocketError = require('error'),
  Letter      = require('models/letter').Letter,
  Artist      = require('models/artist').Artist;

module.exports = function(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {

    socket.on('letters:read', function(data, callback) {
      Letter.fetch(data, function(err, result) {
        if(err) {
          return callback(new SocketError(404, 'Not Found this letter'));
        } else {
          return callback(null, result);
        }
      })
    });

    socket.on('artists:create', function (data, response) {
      //Сохранить данные в базу Artists
      //Если нет есть ошибки сгенерировать ошибку иначе
      //отправить данные обратно к клиенту(Backbone) via response
      Artist.create(data, function(err, result){
        if(err) {
          var error = {};
          if(err.name === 'MongoError') {
            error.nameError = err.message;
            if(err.errors.name) error.name = err.errors.name.message;
            if(err.errors.avatar) error.avatar =err.errors.name.message;
            return response({
              status: 422,
              errors: error
            });
          }
          if(err.name === 'ArtistError') {
            error.name = err.message;
            return response({
              status: 422,
              errors: error
            });
          }
        } else {
          return response(null, result);
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

    socket.on('tracks:read', function(data, response) {
          //Создать массив контактов и отправить их к клиету
          //Push all results in array
          //response the results
          Contact.fetch(data, function(err, result){
            if(err) {
              response({
                status: 404,
                responseText: 'Not Found this contact'
              })
            }else {
              return response(null, result);
            }

          });
        });

  });

  return io
};

