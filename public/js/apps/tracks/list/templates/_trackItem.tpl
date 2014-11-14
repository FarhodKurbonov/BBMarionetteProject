<td>
  <i class="yellowgreen js-play glyphicon glyphicon-play-circle" data-id="<%=id%>"></i>

</td>
<td><a href=""><%= name %></a></td>
<td>
  <%
  var minduration = Math.floor(duration/60);
  var minDisplay = (minduration<10) ? "0"+minduration : minduration;
  var secduration = Math.floor(duration%60);
  var secDisplay = (secduration<10) ? "0"+secduration : secduration;
  var totalDuration = minDisplay+":"+secDisplay
  %><%=totalDuration%>
</td>
<td><%- Math.round(bitRate/1000) + " kbps" %></td>

<td class="">+бэk</td>
<td  class="btn-group">
  <a class="btn btn-default btn-sm js-edit" href="#tracks/<%=id%>/edit">
    <i class="glyphicon glyphicon-edit"></i> Редактировать
  </a>
  <button class="btn btn-default btn-sm js-behavior-confirmable">
    <i class="glyphicon glyphicon-remove-sign"></i> Удалить
  </button>
    <a href="download/<%=id%>" class="btn btn-default btn-sm js-download"><i class="glyphicon glyphicon-cloud-download"></i> скачать
    </a>

</td>




