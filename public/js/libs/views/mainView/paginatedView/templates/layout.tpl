<div class="js-pagination-main">
  <table class="table table-striped">
    <thead>
    <tr><th>Исполнитель</th><th>Кол-во минусовок</th><th><a class="icon-pencil"></th></tr>
    </thead>
    <tbody>
    <tr>
      <td><a href="#artists/<%=id%>/<%=name%>"><%= name %></a></td>
      <td>10</td>
      <td align="right" nowrap>
        <a class="btn btn-small js-edit" href="#contacts/<%=id%>/edit">
          <i class="icon-pencil"></i> Редактировать
        </a>
        <button class="btn btn-small js-behavior-confirmable">
          <i class="icon-remove"></i> Удалить
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</div>
<div class="js-pagination-controls"></div>