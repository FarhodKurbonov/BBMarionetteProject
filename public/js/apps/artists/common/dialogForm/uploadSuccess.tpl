<%
$('.has-feedback').addClass('has-success').end();
$('#artist-avatar').val(avatar).attr('disabled', 'true').end();
%>
<div class='alert alert-success' role='alert'><b>Файл: <%=avatar%> успешно приклеплен</b></div>



