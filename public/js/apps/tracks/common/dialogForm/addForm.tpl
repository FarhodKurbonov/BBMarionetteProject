<% if(name==='') { %>
<div class="form-group has-success has-feedback">
  <label for="trackName" class="col-md-3 control-label">Приклепленнный  файл</label>
  <div class="col-md-9">
    <input type="text" id="artistName" class="form-control" value="<%=trackName%>" name="trackName" disabled="true"/>
    <span class="glyphicon glyphicon-paperclip form-control-feedback"></span>
  </div>
</div>

<div class="form-group">
  <label for="trackName" class="col-md-3 control-label">Название песни</label>
  <div class="col-md-9">
    <input type="text" id="artistName" class="form-control" name="name" value=""/>
    <p class="help-block">Пожалуйста напишите только название песни без дополнительной информации</p>
  </div>
</div>

<div class="form-group">
  <label class="col-md-3 control-label" for="trackType">Тип минусовки</label>
  <div class="col-md-4">
    <select name="type" id="trackType" class="form-control input-sm" >
      <option value="caraoke" >Караоке</option>
      <option value="guitar">Для гитарных</option>
      <option value="saxophone">Для саксофона</option>
      <option value="percussion">Для ударных</option>
    </select>
  </div>

  <div class="col-md-4">
    <select name="quality" id="trackQuality" class="form-control input-sm">
      <option value="аранжировка"> Аранжировка</option>
      <option value="задавка">Задавка</option>
      <option value="нарезка">Нарезка</option>
      <option value="оригинал">Оригинал</option>
    </select>
  </div>

</div>

<div class="form-group">
  <div class="col-md-offset-3 col-md-9">
    <div class="checkbox">
      <label>
        <input type="checkbox" name="vocal"> Бэк вокал
      </label>
      <p class="help-block">Укажите (если есть) наличие подпевки или дополнительного голоса</p>
    </div>
  </div>
</div>

<div class="form-group">
  <label class="col-md-3 control-label" for="trackText">Текст песни</label>
  <div class="col-md-9">
    <textarea class="form-control" rows="8" cols="40" id="trackText" name="songText"></textarea>
    <p class="help-block">
      Это поле может оставаться пустым, но мы очень рекомендуем, по возможности, оставлять и текст песни
    </p>
  </div>
</div>

<div class="form-group">
  <label class="col-md-3 control-label" for="youTubeLink">Сыылка не YouTube </label>
  <div class="col-md-9">
    <input class="form-control" type="text" id="youTubeLink" name="youTubeLink" value=""/>
    <p class="help-block">Ссылка из браузера: http://www.youtube.com</p>
  </div>
</div>

<div class="form-group">
  <div class="col-sm-offset-3 col-sm-9">
    <button type='button' id='UploadButton' class='btn btn-success js-submit'>Сохранить</button>
  </div>
</div>
<% } else { %>
<form class="form-horizontal" role="form">
  <div class="form-group has-feedback">
    <label for="trackName" class="col-md-3 control-label">Приклепленнный  файл</label>
    <div class="col-md-9">
      <input type="text" id="artistName" class="form-control" value="<%= url.urlM.split('/')[2] %>" name="trackName"/>
      <i class="glyphicon glyphicon-paperclip form-control-feedback"></i>
      <p class="help-block update-file">
        <u>Хотите прикрепить новый файл? <i class="glyphicon glyphicon-chevron-down" ></i> </u>
      </p>

      <div class="upload-wrapper">
        <form class="form-horizontal" role="form">
        <span id='UploadArea' style="display: hidden;">

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
        </form>
      </div>
    </div>

  </div>

  <div class="form-group">
    <label for="trackName" class="col-md-3 control-label">Название песни</label>
    <div class="col-md-9">
      <input type="text" id="artistName" class="form-control" name="name" value="<%= name %>"/>
      <p class="help-block">Пожалуйста напишите только название песни без дополнительной информации</p>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-3 control-label" for="trackType">Тип минусовки</label>
    <div class="col-md-4">
      <select name="type" id="trackType" class="form-control input-sm" >
        <option value="caraoke"    <%- type === 'caraoke' ? 'selected': ''%> >Караоке</option>
        <option value="guitar"     <%- type ==='guitar' ? 'selected': ''%> >Для гитарных</option>
        <option value="saxophone"  <%- type ==='saxophone' ? 'selected': ''%> >Для саксофона</option>
        <option value="percussion" <%- type ==='percussion' ? 'selected': ''%> >Для ударных</option>
      </select>
    </div>

    <div class="col-md-4">
      <select name="quality" id="trackQuality" class="form-control input-sm">
        <option value="аранжировка" <%- quality === 'аранжировка' ? 'selected': ''%> > Аранжировка</option>
        <option value="задавка" <%- quality === 'Задавка' ? 'selected': ''%>>Задавка</option>
        <option value="нарезка" <%- quality === 'Нарезка' ? 'selected': ''%> >Нарезка</option>
        <option value="оригинал" <%- quality === 'Оригинал' ? 'selected': ''%> >Оригинал</option>
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
</form>
<% } %>

