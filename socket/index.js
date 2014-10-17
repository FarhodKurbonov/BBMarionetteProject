
var config    = require('config'),
  async       = require('async'),
  log         = require('libs/log.js')(module),
  SocketError = require('error'),
  Letter      = require('models/letter').Letter;

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

/*
    socket.on('contacts:create', function (data, response) {
      //Сохранить данные в базу Contacts
      //Если нет есть ошибки сгенерировать ошибку иначе
      //отправить данные обратно к клиенту(Backbone) via response
      Contact.create(data, function(err, result){
        if(err) {
          var error = {};
          if(err.name == "MongoError") {
            error.phone = err.message;
            return response({
              status: 422,
              errors: error
            });
          }
          if(err.errors.firstName) error.firstName = err.errors.firstName.message;
          if(err.errors.lastName) error.lastName =err.errors.lastName.message;
          return response({
            status: 422,
            errors: error
          });
        }else {
          return response(null, result);
        }
      });
    });

    socket.on('contacts:read', function(data, response) {
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

    socket.on('contacts:update', function(contact, response) {
      //Обновить контакт
      //Отправить обратно the result
      Contact.update(contact, function(err, contact){

        if(err) {
          var error = {};
          if(err.name == "MongoError") {
            error.phone = err.message;
            return response({
              status: 422,
              errors: error,
              entity: contact
            });
          }
          //debugger;
          if(err.errors.firstName) error.firstName = err.errors.firstName.message;
          if(err.errors.lastName) error.lastName = err.errors.lastName.message;

          return response({
            status: 422,
            errors: error,
            entity: contact
          });
        } else {
          return response(null, contact);
        }
      });

    });

    socket.on('contacts:delete', function(contact, response) {
      //Удаляем контакт
      //Отправить обратно the result
      Contact.deleteContact(contact, function(err, contact) {

        if(err) {
          return response(new ContactError(401, err.message))
        }
        return response(null, contact);
      });
    })*/
  });

  return io
};

