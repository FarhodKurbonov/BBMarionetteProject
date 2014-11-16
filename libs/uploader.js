var mime        = require('mime'),
    exec        = require('child_process').exec,
    probe       = require('node-ffprobe'),
    async       = require('async'),
    sharp       = require('sharp'),
    log         = require('libs/log.js')(module),
    fs          = require('fs'),
   //=========Constants==========
    DOWNLOAD    = 'mp3/',
    TEMP        = 'temp/',
    AVATAR      = 'avatar/';

/**
 *
 * @param socket
 * @param file
 * @constructor
 * @abstract
 */
var FileHandler = function(file, socket) {
  if(this.constructor === FileHandler) {
    throw new Error("Can't instantiate abstract class!");
  }
  //initialization code

};
FileHandler.prototype.saveFile = function () {
  throw new Error('Abstract method');
};
/**
 * @param file
 * @param socket
 * @returns {Object.<FileHandler>}
 */
FileHandler.getInstance = function (file, socket) {
  var fileType =  mime.lookup(file).split('/')[0];

  if(fileType == 'audio') {
    return new SoundSaver(file, socket);
  } else if(fileType == 'image'){
    return new ImageSaver(file, socket);
  }
  return socket.emit('done', {trackName : file, success: false});
};

//======================SoundSaver=======================
/**
 * @param file
 * @param socket
 * @constructor
 * @extend FileHandler
 */
var SoundSaver = function (file, socket) {
  FileHandler.apply(this, arguments);
  //soundSaver init code
  this.file = file;
  this.socket = socket;
};
SoundSaver.prototype= Object.create(FileHandler.prototype);
SoundSaver.prototype.constructor = SoundSaver;
/**
 * handler for save audio data
 */
SoundSaver.prototype.saveFile = function () {
  var self = this;
  probe(TEMP+this.file, function(err, probeData) {
    //if user change file extension for hack
    if(err)
      return self.socket.emit('done', {success: false});
    var ext = probeData.fileext;
    var trackName = probeData.filename;

    //if user upload file other format(ACC, mp2 )
    if(ext != '.mp3' && ext!=".MP3" && ext != '.mp4' && ext != '.ogg' && ext != '.wav' && ext != '.wma') {
      fs.unlink(TEMP + trackName, function () {
        if(err) log.error('Ошибка при удалении файла загружженого неизвестного фоармата'+ trackName);
        return self.socket.emit('done', {trackName : trackName, success: false});
      });
      return;
    }
    if(ext != ".mp3" && ext!=".MP3" ) {
      //We need file name without extension
      var nameWithoutExt = trackName.split('.');
      nameWithoutExt = nameWithoutExt.slice(0, nameWithoutExt.length - 1).join('');
      //Convert file to .mp3
      exec("ffmpeg -i " + TEMP+trackName  + " " +  DOWNLOAD+nameWithoutExt+".mp3", function(err){
        if(err) return self.socket.emit('done', {success: "errorConversation"});
        fs.unlink(TEMP + trackName, function () {
          if(err) return self.socket.emit('done', {success: "errorConversation"});
          return self.socket.emit('done', {trackName : nameWithoutExt+".mp3", success: true});
        })
      });
      return;
    }
    var readable = fs.createReadStream(TEMP+trackName);
    readable.pipe(fs.createWriteStream(DOWNLOAD+trackName));
    readable.on('end', function() {
      fs.unlink(TEMP + trackName, function (err) {
        if(err) return self.socket.emit('done', {trackName : trackName, success: false});
        return self.socket.emit('done', {trackName : trackName, success: true});
      });
    });

  });
};

//======================ImageSaver=======================
/**
 * @param file
 * @param socket
 * @constructor
 * @extend FileHandler
 */
var ImageSaver = function (file, socket) {
  FileHandler.apply(this, arguments);
  //soundSaver init code
  this.file = file;
  this.socket = socket;
};
ImageSaver.prototype= Object.create(FileHandler.prototype);
ImageSaver.prototype.constructor = ImageSaver;
/**
 * handler for save image data
 */
ImageSaver.prototype.saveFile = function () {
  var self = this;
  async.series([
    function (callback) {
      sharp(TEMP+self.file).resize(200, 200).toFile(AVATAR+self.file, function(err) {
        if (err)    return callback(err);
        return callback(null)
      });
    }/*,
    function (callback) {
      log.info('Attempt to delete temp/:file');
        fs.unlink(TEMP + self.file, function (err) {

          if(err) return callback(err);
          log.info('sucess to delete temp/:file');
          return callback(null);
        });
    }*/
  ], function (err) {
       if(err) self.socket.emit('done', {avatar : self.file, success: false});

       return self.socket.emit('done', {avatar : self.file, success: true});
  });
};




exports.uploader = FileHandler;