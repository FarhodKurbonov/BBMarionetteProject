define(['app',
        'marionette',
        'ss',
        'tpl!apps/tracks/common/spinner.tpl',
        'spin.jquery'
], function(App, Marionette, ss, spinTpl){
  App.module('TracksApp.Upload', function(Upload, App, Backbone, Marionette, $, _) {
    /**
     * Это соответствующие HTML5 объекты которые мы собираемся использовать
     * если их нет значит браузер не поддерживате загрузгу файлов
     * выводим сообщение об этом пользователю
     */
    Upload.startUploadFile = function(template) {

      if (window.File && window.FileReader) {
        var SelectedFile,
          nameBox    = $('#NameBox'),
          fileBox    = $('#FileBox'),
          uploadArea = $('#UploadArea'),
          uploadButton =  $('#UploadButton'),
          downloaded = 0,
          blobStream,
          progressBar,
          percent,
          MB;

        if(uploadButton.data('uploadButton')=='listen' && fileBox.data('fileBox')=='listen'){
          return ;
        } else{
          uploadButton.on('click', StartUpload)
            .data('uploadButton', 'listen');

          fileBox.on('change', fileChosen)
            .data('fileBox', 'listen');
        }
      } else {
        uploadArea.html( "Ваш браузер не поддерживат загрузку файлов. Пожалуйста обновите ваш браузер");
      }
      //eventHandler.
      function fileChosen(event) {
        SelectedFile = event.target.files[0];
        nameBox.val( SelectedFile.name);
      }

      function StartUpload(event) {
        if( fileBox.val() != "" ) {
          var fileName = nameBox.val();
          var stream = ss.createStream();
          blobStream = ss.createBlobReadStream(SelectedFile);

          //Это нужно в будещем исравить...
          var content = "<span id='NameArea'>Загрузка файла: " + fileName + "</span>";
          content += '<div id="ProgressContainer"><div id="progressBar"></div></div><span id="percent">0%</span>';
          content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
          uploadArea.html(content);

          progressBar = $('#progressBar');
          percent     = $('#percent');
          MB          = $('#MB');

          ss(socket).emit('Upload', stream, { 'Name' : fileName, size : SelectedFile.size });
          blobStream.on('data', function (chunk) {
            downloaded += chunk.length;
            var percent = (downloaded / SelectedFile.size) * 100;
            UpdateBar(percent);
          });
          blobStream.pipe(stream);
          //If file send...
          blobStream.on('end', function() {
            //Прежде чем сервер сгенерит событие 'done'
            // ему нужно время для обработки загрузженного файла
            // Поэтому мы выводим сообщение пользователю что данные обрабатываются на сервере
            uploadArea.html( Marionette.Renderer.render(spinTpl, {} ) );
            Upload.Spin();
            //Данные обработаны, так что можно генерить форму
            socket.on('done', function(data) {
              switch (data.success) {
                //Если все успешно...
                case true :
                  uploadArea.html(Marionette.Renderer.render(template, data || {}));
                  //Удалем обработчики
                  $('#UploadButton').off();
                  $('#FileBox').off();
                  break;
                //Если попытались отпавить файл неподдерживаемого формата
                case false:
                  uploadArea.html( "<div class='alert alert-error' role='alert'>Ошибка: Файл неподдерживаемого формата</div>" );
                  break;
                //Елси при конвертации файла, на сервере произошла ошибка..
                case 'errorConversation':
                  uploadArea.html( "<div class='alert alert-error' role='alert'>Произошла ошибка конвертации. Попытайтесь заргузить файл заново</div>" );
                  break;
              }
            });
          });
        } else {
          alert("Пожалуйста добавьте файл!");
        }
      }

      //===============Generate html content=========


      //================Helper========================
      function UpdateBar(percentage) {
        progressBar.css('width', function() {
          return percentage + '%'
        });
        percent.html( Math.round(percentage*100) / 100 + '%' );
        MB.html( Math.round( ( (percentage/100)*SelectedFile.size)/1048576 ) );
      }

    };

    //Наш спиннер
    Upload.Spin =  function () {
      var opts = {
        lines: 7,
        length: 4,
        width: 13,
        radius: 11,
        corners: 1,
        rotate: 0,
        direction: 1,
        color: '#0A671A',
        speed: 0.8,
        trail: 80,
        shadow: true,
        hwaccel: false,
        className: 'spinner',
        zIndex: 2e9,
        top: '40%',
        left: '50%'
      };
       $('#spinner').spin(opts);
    }

  });
  return App.TracksApp.Upload;
});