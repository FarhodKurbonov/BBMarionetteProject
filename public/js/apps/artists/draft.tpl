<div class="container" id="mainLayout-region">

  <div class="row" id="main-layout">{*<--First Lavel Layout *}
    <div class="col-lg-7" id="leftbar-region"></div>{*<--Second Lavel Layout*}
    <div class="col-lg-93" id="content-region">{*<--Second Lavel Layout*}
      <div class="row">
        <div id="content-header-region">{*<--Third Lavel Layout*}
          <div id="page-header">
            <h1><span>Исполнители на букву</span>«A»</h1>
          </div>
          <div id="thumbnails">
            {*Here will be a thumnails*}
            <div class="thumbnail">
              <a href="/аквариум/">
                <img src="/files/artists_new/4/9/8/1/1-150.jpg" width="140px" class="img-round">
              </a>
              <div class="caption">
                <h5><a href="/аквариум/">Аквариум</a></h5>
              </div>
            </div>
            <div class="thumbnail">
              <a href="/алиса/">
                <img src="/files/artists_new/5/0/0/6/1-150.jpg" width="140px" class="img-round">
              </a>
              <div class="caption">
                <h5><a href="/алиса/">Алиса</a></h5>
              </div>
            </div>
            <div class="thumbnail">
              <a href="/алла-пугачева/">
                <img src="/files/artists_new/5/0/0/8/1-150.jpg" width="140px" class="img-round">
              </a>
              <div class="caption">
                <h5><a href="/алла-пугачева/">Алла Пугачева</a></h5>
              </div>
            </div>
            <div class="thumbnail">
              <a href="/александр-башлачёв/">
                <img src="/files/artists_new/4/9/8/4/1-150.jpg" width="140px" class="img-round">
              </a>
              <div class="caption">
                <h5><a href="/александр-башлачёв/">Александр Башлачёв</a></h5>
              </div>
            </div>
          </div>
        </div>{*<--Third Lavel Layout*}
        <div id="content-main-region" class="col-lg-70">{*<--Third Lavel Layout*}
          <div id="panel-region">
            <button class="btn btn-primary js-new">Добавить контакт</button>
            <form id="filter-form" class="form-search form-inner pull-right">
              <div class="input-append">
                <input type="text" class="span2 search-query js-filter-criterion"/>
                <button type="submit" class="btn">Фильтровать</button>
              </div>
            </form>
          </div>
          <div class="arists-region">{*<--Fourth Lavel Layout*}
            <div class="js-pagination-main">
              <table table table-striped>
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
            <div class="js-pagination-controls">
              <% if( totalPages > 1 ){ %>
              <ul>
                <% if( currentPage > 1 ) { %>
                <li><a href="#<%- urlBase ? urlBase + 1 : '' %>" class="navigatable" data-page="1">&laquo;</a></li>
                <li><a href="#<%- urlBase ? urlBase + previous : '' %>" class="navigatable" data-page="<%- previous %>">&lsaquo;</a></li>
                <% } else { %>
                <li class="disabled"><a href="#">&laquo;</a></li>
                <li class="disabled"><a href="#">&lsaquo;</a></li>
                <% } %>
                <% if(pageSet[0] > 1 ){ %>
                <li class="disabled"><a href="#">...</a></li>
                <% } %>

                <% _.each(pageSet, function(page){ %>
                <%if( page === currentPage ){ %>
                <li class="active disabled"><a href="#"><%- page%></a></li>
                <% } else { %>
                <li><a href="#<%- urlBase ? urlBase + page : ''%>" class="navigatable" data-page="<%- page %>"><%- page%></a></li>
                <% } %>
                <% }); %>

                <% if( pageSet[pageSet.length - 1] !== lastPage ) { %>
                <li class="disabled"><a href="#">...</a></li>
                <li><a href="#<%- urlBase ? urlBase + lastPage : '' %>" class="navigatable" data-page="<%- lastPage %>"><%- lastPage%></a></li>
                <% } %>

                <% if( currentPage !== lastPage ){ %>
                <li><a href="#<%- urlBase ? urlBase + next : '' %>" class="navigatable" data-page="<%- next %>">&rsaquo;</a></li>
                <li><a href="#<%- urlBase ? urlBase + lastPage : '' %>" class="navigatable" data-page="<%- lastPage %>">&raquo;</a></li>
                <% }else{ %>
                <li class="disabled"><a href="#">&rsaquo;</a></li>
                <li class="disabled"><a href="#">&raquo;</a></li>
                <% } %>
              </ul>
              <% } %>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</div>