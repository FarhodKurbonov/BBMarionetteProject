

  <div class="form-group has-feedback">
    <label for="track-fileName" class="col-md-3 control-label">Приклепленнный  файл</label>
    <div class="col-md-9">
      <input type="text" id="track-fileName" class="form-control" value="<%= url.urlM.split('/')[1] %>" name="trackName"/>
      <input type="hidden" id="reload" value="" name="reload"/>
      <i class="glyphicon glyphicon-paperclip form-control-feedback"></i>

      <p class="help-block update-file">
        <u>Хотите прикрепить новый файл? <i class="glyphicon glyphicon-chevron-down" ></i> </u>
      </p>

      <div class="upload-wrapper">
        <form class="form-horizontal" role="form">
        <div id='UploadArea'>
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

        </div>
        </form>
      </div>
    </div>

  </div>

  <div class="form-group">
    <label for="trackName" class="col-md-3 control-label">Название песни</label>
    <div class="col-md-9">
      <input type="text" id="trackName" class="form-control" name="name" value="<%= name %>"/>
      <p class="help-block">Пожалуйста напишите только название песни без дополнительной информации</p>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-3 control-label" for="trackType">Тип минусовки</label>
    <div class="col-md-4">
      <select name="type" id="trackType" class="form-control input-sm" >
        <option value="caraoke"    <%- fonogrammType === 'caraoke' ? 'selected': ''%> >Караоке</option>
        <option value="guitar"     <%- fonogrammType ==='guitar' ? 'selected': ''%> >Для гитарных</option>
        <option value="saxophone"  <%- fonogrammType ==='saxophone' ? 'selected': ''%> >Для саксофона</option>
        <option value="percussion" <%- fonogrammType ==='percussion' ? 'selected': ''%> >Для ударных</option>
      </select>
    </div>

    <div class="col-md-4">
      <select name="quality" id="trackQuality" class="form-control input-sm">
        <option value="аранжировка" <%- quality === 'аранжировка' ? 'selected': ''%> > Аранжировка</option>
        <option value="задавка" <%- quality === 'задавка' ? 'selected': ''%>>Задавка</option>
        <option value="нарезка" <%- quality === 'нарезка' ? 'selected': ''%> >Нарезка</option>
        <option value="оригинал" <%- quality === 'оригинал' ? 'selected': ''%> >Оригинал</option>
      </select>
    </div>

  </div>

  <div class="form-group">
    <div class="col-md-offset-3 col-md-9">
      <div class="checkbox">
        <label>
          <input type="checkbox" name="vocal" <%- vocal === true ? 'checked': ''%> > Бэк вокал
        </label>
        <p class="help-block">Укажите (если есть) наличие подпевки или дополнительного голоса</p>
      </div>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-3 control-label" for="trackText">Текст песни</label>
    <div class="col-md-9">
      <textarea class="form-control" rows="8" cols="40" id="trackText" name="songText">
        <%= songText %>
      </textarea>
      <p class="help-block">
        Это поле может оставаться пустым, но мы очень рекомендуем, по возможности, оставлять и текст песни
      </p>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-3 control-label" for="youTubeLink">Сыылка не YouTube </label>
    <div class="col-md-9">
      <input class="form-control" type="text" id="youTubeLink" name="youTubeLink" value="<%=youTubeLink%>"/>
      <p class="help-block">Ссылка из браузера: http://www.youtube.com</p>
    </div>
  </div>

  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <button type='button' id='UploadButton' class='btn btn-success js-submit'><i class="glyphicon glyphicon-floppy-save"></i> Сохранить</button>
    </div>
  </div>



