var BaseController = require("./BaseController"),
    View           = require("../views/BaseView"),
    log            = require('libs/log.js')(module);

module.exports = BaseController.extend({
  name: "ImageController",
  content: null,
  run: function(req, res, next) {
    var self = this;
    var imgFile = req.params.avatar;
    //Отдаем идексную страницу
    res.download('avatar/'+imgFile);
    //self.sendfile('/avatar/'+imgFile, req, res)


  },
  getContent: function(callback) {
    var self = this;
    this.content = {};
    callback(this.content)

  }
/*  sendFile: function(filePath, req, res) {
    //Определяем mime
    var mimeType = mime.lookup(filePath);
    //Удаляем ненужню шифрованную часть имени файла
    var splFn = filePath.split('/');
    splFn.splice(0, 1);//удалили часть "/mp3"
    splFn = splFn.join('').split('_');
    splFn.splice(splFn.length - 2, 1);
    var sendedFileName = splFn.join('');

    var stat = fs.statSync(filePath);
//====================================================
    var total = stat.size;
    if (req.headers['range']) {
      var range = req.headers.range;
      var parts = range.replace(/bytes=/, "").split("-");
      var partialstart = parts[0];
      var partialend = parts[1];

      var start = parseInt(partialstart, 10);
      var end = partialend ? parseInt(partialend, 10) : total-1;
      var chunksize = (end-start)+1;
      log.info('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

      var file = fs.createReadStream(filePath, {start: start, end: end});

      res.writeHead(200, {
        'Content-disposition' : 'attachment; filename=' + sendedFileName,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType
      });
      file.pipe(res);
    } else {
      log.info('ALL: ' + total);
      res.writeHead(200, {
        'Content-disposition' : 'attachment; filename=' + sendedFileName,
        'Content-Length': total,
        'Content-Type': mimeType
      });
      file = fs.createReadStream(filePath);
      file.pipe(res);
    }
//=================================================

    //file.pipe(res);
    file.on('error', function(err) {
      res.statusCode = 500;
      res.end('Sever Error');
      log.error('err');
    });
    file
      .on('open', function() {
        log.info('file open');
      })
      .on('close', function () {
        log.info('file close');
      });
    res.on('close', function() {
      file.destroy();
      log.info('file destroy');
    })
  }*/
});