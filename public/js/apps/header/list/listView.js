define(['app',
  'tpl!apps/header/list/templates/_header.tpl',
  'tpl!apps/header/list/templates/headers.tpl'
], function (App, _headerTpl, headersTpl) {
  App.module('HeaderApp.List', function(List, App, Backbone, Marionette, $, _) {

    List.Header = Marionette.ItemView.extend({
      template: _headerTpl,
      tagName : 'li'

    });

    List.Headers = Marionette.CompositeView.extend({
      template: headersTpl,
      childView: List.Header,
      childViewContainer: 'ul'

    })
  });
  return App.HeaderApp.List;
});