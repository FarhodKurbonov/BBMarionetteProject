define([
        'marionette',
        'ss'
], function(Marionette, ss){

    /**
     * Это соответствующие HTML5 объекты которые мы собираемся использовать
     * если их нет значит браузер не поддерживате загрузгу файлов
     * выводим сообщение об этом пользователю
     */
    function startUploadFile(template) {

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

      function fileChosen(event) {
        SelectedFile = event.target.files[0];
        nameBox.val( SelectedFile.name);
      }

      function StartUpload(event) {
        if( fileBox.val() != "" ) {
          var fileName = nameBox.val();
          var stream = ss.createStream();
          blobStream = ss.createBlobReadStream(SelectedFile);

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
        } else {
          alert("Пожалуйста добавьте файл!");
        }
      }

      //===============Generate html content=========
      socket.on('done', function(data) {
        switch (data.success) {
          case true :
            var renderContent = Marionette.Renderer.render(template, data || {});
            uploadArea.html( renderContent );
            $('#UploadButton').off();
            $('#FileBox').off();
            break;
          case false:
            uploadArea.html( "<div class='alert alert-error' role='alert'>Ошибка: Файл неподдерживаемого формата</div>" );
            break;
          case 'errorConversation':
            uploadArea.html( "<div class='alert alert-error' role='alert'>Произошла ошибка при загрузке. Попытайтесь заргузить заново</div>" );
            break;
        }
      });

      //================Helper========================
      function UpdateBar(percentage) {
        progressBar.css('width', function() {
          return percentage + '%'
        });
        percent.html( Math.round(percentage*100) / 100 + '%' );
        MB.html( Math.round( ( (percentage/100)*SelectedFile.size)/1048576 ) );
      }

    }


  return startUploadFile;
});