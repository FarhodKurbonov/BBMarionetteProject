define([
  'app',
  'libs/views/_base/ItemView',
  'libs/views/_base/CompositeView',
  'tpl!apps/header/list/templates/header.tpl',
  'tpl!apps/header/list/templates/headers.tpl'
], function(App,/*Views*/ ItemView, CompositeView,/*Templates*/ headerTpl, headersTpl) {
  App.module('HeaderApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Header = ItemView.extend({
      template: headerTpl,
      tagName: 'li',

      events: {
        'click a': 'navigate'
      },

      navigate: function (e) {
        e.preventDefault();
        this.trigger('navigate', this.model);
      },
      onRender: function () {
        if (this.model.selected) {
          this.$el.addClass('active');
        }
      }
    });


    List.Headers = CompositeView.extend({
      tagName: 'navbar',
      template: headersTpl,
      childView: List.Header,
      childViewContainer: 'ul',

      events: {
        'click a.navbar-brand': 'brandClicked'
      },
      brandClicked: function (e) {
        e.preventDefault();
        this.trigger('brand:clicked')
      }

    })
  });
  return App.HeaderApp.List;
});