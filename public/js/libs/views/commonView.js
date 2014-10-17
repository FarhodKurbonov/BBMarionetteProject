define(['app',
  'libs/views/_base/ItemVew',
  'libs/views/_base/LayoutView',
  'tpl!libs/views/templates/layout.tpl',
  'tpl!libs/views/templates/loadingView.tpl',
  'tpl!libs/views/templates/paginationControls.tpl',
  'spin.jquery'
], function (App, /*Marionette Views->*/ItemView, LayoutView, /*Templates->*/layoutTpl, loadingView, pageControlTpl) {
  App.module("Views.Common", function (Common, ContactManager, Backbone, Marionette, $, _) {

/*    Common.PaginatedView = LayoutView.extend({
      template: layoutTpl,

      regions: {
        paginationControlsRegion: ".js-pagination-controls",
        paginationMainRegion: ".js-pagination-main"
      },

      initialize: function (options) {
        this.collection = options.collection;
        var eventsToPropagate = options.propagatedEvents || [];

        var listView = new options.mainView({
          collection: this.collection
        });
        var controls = new Views.PaginationControls({
          paginatedCollection: this.collection,
          urlBase: options.paginatedUrlBase
        });

        var self = this;
        this.listenTo(controls, "page:change", function (page) {
          self.trigger("change:page", page);

        });
        _.each(eventsToPropagate, function (evt) {
          self.listenTo(listView, evt, function (view, model) {
            self.trigger(evt, view, model);
          });
        });

        this.on("show", function () {
          this.paginationControlsRegion.show(controls);
          this.paginationMainRegion.show(listView);
        });
      }
    });*/

    Common.Loading = ItemView.extend({
      template: loadingView,

      initialize: function (options) {
        var options = options || {};
        this.title = options.title || 'Загрузка данных...';
        this.message = options.message || 'Пожалуйста подождите, идет загрузка данных.';
      },

      serializeData: function () {
        return {
          title: this.title,
          message: this.message
        }
      },

      onShow: function () {
        var opts = {
          lines: 13,
          length: 20,
          radius: 30,
          corners: 1,
          rotate: 0,
          direction: 1,
          color: '#000',
          speed: 1,
          trail: 60,
          shadow: true,
          hwaccel: false,
          className: 'spinner',
          zIndex: 2e9,
          top: '50%',
          left: '50%'
        };
        $('#spinner').spin(opts)
      }
    });

/*    Common.PaginationControls = ItemView.extend({
      template: pageControlTpl,
      className: "pagination",

      initialize: function (options) {
        this.paginatedCollection = options.paginatedCollection;
        this.urlBase = options.urlBase;
        this.listenTo(this.paginatedCollection, "page:change:after", this.render);
      },

      events: {
        "click a[class=navigatable]": "navigateToPage"
      },

      navigateToPage: function (e) {
        e.preventDefault();
        var page = parseInt($(e.target).data("page"), 10);
        this.paginatedCollection.parameters.set("page", page);
        this.trigger("page:change", page);
      },

      serializeData: function () {
        var data = this.paginatedCollection.info(),
          url = this.urlBase,
          criterion = this.paginatedCollection.parameters.get('criterion');
        if (url) {
          if (criterion) {
            url += 'criterion' + criterion + '+';
          }
          url += 'page:';
        }
        data.urlBase = url;
        return data;
      }
    });*/

  });
  return App.Views.Common;
})