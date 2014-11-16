<% if( single && avatar ) { %>

<a>
  <img src="image/<%=avatar%>" width="140px" class="img-round">
</a>
<div class="caption">
  <h5>
    <a href="#tracks/<%=name%>/<%=id%>"><%=name%></a>
  </h5>
</div>


<% } else if(avatar) { %>
<a href="#tracks/<%=name%>/<%=id%>">
  <img src="image/<%=avatar%>" width="140px" class="img-round">
</a>
<div class="caption">
  <h5>
    <a href="#tracks/<%=name%>/<%=id%>"><%=name%></a>
  </h5>
</div>

<%}%>