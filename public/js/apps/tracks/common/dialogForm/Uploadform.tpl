<form class="form-horizontal" role="form">
    <div id="UploadBox">

        <span id='UploadArea'>

          <div class="form-group">
            <label for="FileBox" class="col-sm-3 control-label">Выберите файл</label>

            <div class="col-sm-9">
              <input type="file" id="FileBox" class="form-control">
              <p class="help-block">Размер файла не должен превышать 15MB</p>
            </div>
          </div>
          <div class="form-group">
            <label for="NameBox" class="col-sm-3 control-label">Имя файла</label>

            <div class="col-sm-9">
              <input type="text" id="NameBox" class="form-control"><br>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-3 col-sm-9">

              <button type='button' id='UploadButton' class='btn btn-success'>
                <i class="glyphicon glyphicon-cloud-upload"></i> Загрузить</button>
            </div>
          </div>

        </span>
    </div>
</form>


