<% if( allOrSingleArtist === 'AllArtists' ) { %>
<div class="page-header">
  <h1>Исполнители на букву: <%=letter%></h1>
</div>
<% } else { %>
<div class="page-header">
  <h1><%=name%> | <span>Все минусовки(<%=count%>)</span> </h1>
</div>
<%}%>