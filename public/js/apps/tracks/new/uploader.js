define([
        'marionette',
        'tpl!apps/tracks/common/dialogForm/addForm.tpl',
        'tpl!apps/tracks/common/dialogForm/uploadForm.tpl'

], function(Marionette, extendFormTpl, uploadFormTpl){

  /**
       * Это соответствующие HTML5 объекты которые мы собираемся использовать
       * если их нет значит браузер не поддерживате загрузгу файлов
       * выводим сообщение об этом пользователю
       */
  function startUploadFile() {

    if (window.File && window.FileReader) {
      var   uploadButton =  $('#UploadButton');
      var   fileBox     =   $('#FileBox');
      if(uploadButton.data('UploadButton')=='listen' && fileBox.data('fileBox')=='listen'){
        return;
      } else{
        uploadButton.on('click', StartUpload).data('UploadButton', 'listen');
        fileBox.on('change', FileChosen).data('fileBox', 'listen');
      }
    } else {
      document.getElementById('UploadArea')
        .innerHTML = "Ваш браузер не поддерживат загрузку файлов. Пожалуйста обновите ваш браузер";

    }
  }

    /**
     * Как только файл выбран выводим имя файла в input
     */
    var SelectedFile;
    function FileChosen(event) {
      SelectedFile = event.target.files[0];
      document.getElementById('NameBox').value = SelectedFile.name;

    }

    var FReader;
    var Name;
    function StartUpload(event, artName) {
      if(document.getElementById('FileBox').value != "") {
        FReader = new FileReader();
        Name = document.getElementById('NameBox').value;
        var Content = "<span id='NameArea'>Загрузка файла: " + SelectedFile.name + "</span>";
        Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
        Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
        document.getElementById('UploadArea').innerHTML = Content;
        FReader.onload = function(evnt){
          window.socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
        };
          window.socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size , 'ArtName': artName});

      } else {
        alert("Пожалуйста добавте файл!");

      }
    }

    window.socket.on('MoreData', function (data){
      UpdateBar(data['Percent']);
      var Place = data['Place'] * 524288; //The Next Blocks Starting Position
       //The Variable that will hold the new Block of Data
      var NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size - Place)));

      FReader.readAsBinaryString(NewFile);
    });
    function UpdateBar(percent) {
      document.getElementById('ProgressBar').style.width = percent + '%';
      document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
      var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
      document.getElementById('MB').innerHTML = MBDone;
    }

    socket.on('Done', function (track, fileSize) {
      if(fileSize ==  SelectedFile.size && Name == track){
        var html = Marionette.Renderer.render(extendFormTpl, track || {});
        document.getElementById('UploadArea').innerHTML = html;
      } else {
        html = Marionette.Renderer.render(uploadFormTpl,{});
        document.getElementById('UploadArea').innerHTML = html;
        document.getElementById('UploadArea').insertAdjacentHTML('afterBegin', "<div class='alert alert-success' role='alert'>Файл: " + track.trackName + " успешно загружен</div>" );
        document.getElementById('artistName').value = track.trackName;

      }

      $('#UploadButton').off();
      $('#FileBox').off();



    });

  return startUploadFile;
});