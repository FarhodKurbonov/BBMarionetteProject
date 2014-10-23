define(['app',
  'libs/views/_base/ItemView',
  'libs/views/_base/LayoutView',
  'tpl!libs/views/templates/loadingView.tpl',
  'tpl!libs/views/templates/ru_en_Layout.tpl',
  'tpl!libs/views/templates/ContentHeaderLayout.tpl',
  'tpl!libs/views/templates/contentMainLayout.tpl',
  'tpl!libs/views/templates/paginationControls.tpl',
  'spin.jquery'
], function (App, /*Marionette Views->*/ItemView, LayoutView, /*Templates->*/loadingView, ru_en_tpl, ContentHeaderLayout, ContentMainLayout, pageControlTpl) {
  App.module("Views.Common", function (Common, ContactManager, Backbone, Marionette, $, _) {
    /**
     * Используется для анимации во время загрузки данных с сервера
     * использует плагин jquery.spin а также интерфейс spin.js
     * @ {}
     *
     */
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
    /**
     * @constructor
     * @type {Object.<Marionette.LayoutView>}
     * @extends {App.Views.LayoutView}
     */
    Common.RuEnView = LayoutView.extend({
      template: ru_en_tpl,

      regions : {
        en:  '.js-en-letters',
        ru: '.js-ru-letters'
      },
      initialize: function(options) {
        var models = options.collection.models;
        var eventsToPropagate = options.propagatedEvents || [];
        var enCollection  = [];
        var ruCollection = [];
        for(var i = 0; i < models.length; i++ ) {

            if(i < 27){
              enCollection.push(models[i]);
            } else {
              ruCollection.push(models[i]);
            }
        }
        var self = this;
        var enLetters = new options.mainView({
          collection: new Backbone.Collection(enCollection)
        });
        _.each(eventsToPropagate, function (evt) {
          self.listenTo(enLetters, evt, function (view, model) {
            self.trigger(evt, view, model);
          });
        });

        var ruLetters = new options.mainView({
          collection: new Backbone.Collection(ruCollection)
        });
        _.each(eventsToPropagate, function (evt) {
          self.listenTo(ruLetters, evt, function (view, model) {
            self.trigger(evt, view, model);
          });
        });
        this.on('show', function() {
          this.en.show(enLetters);
          this.ru.show(ruLetters);
        })


      }
    });

    Common.ContentHeader = ItemView.extend({
      template: ContentHeaderLayout
/*      regions: {
        pageHeaderRegion: '',
        thumbnailsRegion: ''
      },
      initialize: function (options) {
        var letter        = options.letter;
        var famousArtists = options.famousArtists

      }*/
    });

    Common.ContentMain   = LayoutView.extend({
      template: ContentMainLayout,
      regions: {
        paginationMainRegion: "#pagination-main-region",
        paginationControlsRegion: '#pagination-controls-region'
      },
      initialize: function (options) {
        this.collection = options.collection;
        var eventsToPropagate = options.propagatedEvents || [];
        var listArtists = new options.mainView({
          collection: this.collection
        });
        var pageControls = new Common.PaginationControls({
          paginatedCollection: this.collection,
          urlBase: options.paginatedUrlBase
        });

        var self = this;
        this.listenTo(pageControls, "page:change", function (page) {
          self.trigger("change:page", page);
        });
        _.each(eventsToPropagate, function (evt) {
          self.listenTo(listArtists, evt, function (view, model) {
            self.trigger(evt, view, model);
          });
        });

        this.on("show", function () {
          this.paginationMainRegion.show(listArtists);
          this.paginationControlsRegion.show(pageControls);
        });
      }



    });

    Common.PaginationControls = Marionette.ItemView.extend({
      template: pageControlTpl,

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
    });
  });
  return App.Views.Common;
});