<% if(changedOnServer) { %>
<p class="alert alert-info">
    Этот исолнитель был обновлен на сервере. Во время вашей редакции исполнителя кто то уже изменил значения.
</p>
<% } %>

<form class="form-horizontal" role="form">
    <div class="form-group">
        <label for="artist-name" class="col-sm-3 control-label">Имя:</label>
        <div class="col-sm-9">
          <input  type="text" class="form-control" id="artist-name" name="name" value="<%= name %>"/>
        </div>
    </div>

    <div class="form-group">
        <label for="artist-avatar" class="col-sm-3 control-label">Аватар:</label>
        <div class="col-sm-9">
          <input  type="text" class="form-control" id="artist-avatar" name="avatar" value="<%= avatar %>"/>
        </div>
    </div>
    <div class="form-group">
      <div class="col-sm-offset-3 col-sm-9">
        <button class="btn btn-success js-submit">Сохранить</button>
      </div>
    </div>
</form>
