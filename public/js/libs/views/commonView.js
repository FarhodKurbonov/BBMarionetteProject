define(['app',
  'libs/views/_base/ItemView',
  'libs/views/_base/CompositeView',
  'libs/views/_base/LayoutView',
  'tpl!libs/views/templates/loadingView.tpl',
  'tpl!libs/views/templates/ru_en_Layout.tpl',
  'tpl!libs/views/templates/ContentHeaderLayout.tpl',
  'tpl!libs/views/templates/contentMainLayout.tpl',
  'tpl!libs/views/templates/paginationControls.tpl',
  'tpl!libs/views/templates/thumbnail.tpl',
  'tpl!libs/views/templates/thumbnails.tpl',
  'tpl!libs/views/templates/pageHeader.tpl',
  'spin.jquery'
], function (App, /*Marionette Views->*/ItemView, CompositeView, LayoutView, /*Templates->*/loadingView, ru_en_tpl, ContentHeaderLayout, ContentMainLayout, pageControlTpl, thumbnailTpl, thumbnailsTpl, pageHeaderTpl) {
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

    Common.ContentHeader = LayoutView.extend({
      template: ContentHeaderLayout,
      regions: {
        pageHeaderRegion: '#page-header',
        thumbnailsRegion: '#thumbnails'
      },
      initialize: function (options) {
        //if options.avatar is collection pluck only one model
        //another get assignment model
        var info = options.avatar[0] || options.avatar;
        var avatars = options.avatar
        var allOrSingleArtist = options.allOrSingleArtist;
         var pageHeader = new Common.PageHeader({
           allOrSingleArtist: allOrSingleArtist,
           model: info
         });
        var thumbnails  = new Common.Thumbnails({
          single: options.single,
          collection: new Backbone.Collection(avatars)
        });

        this.on('show', function() {
          this.pageHeaderRegion.show(pageHeader);
          this.thumbnailsRegion.show(thumbnails);
        })
      }
    });

    Common.PageHeader = ItemView.extend({
      template: pageHeaderTpl,
      serializeData: function(options) {
        var data = ItemView.prototype.serializeData.apply(this, arguments);
        data.allOrSingleArtist = this.options.allOrSingleArtist;
        //console.dir(data.allOrSingleArtist);
        return data;
      }
    });

    Common.Thumbnail = ItemView.extend({
      template: thumbnailTpl,
      className: 'thumbnail',
      initialize: function(options){
        this.single = options.single
      },
      serializeData: function(options) {
        var data = ItemView.prototype.serializeData.apply(this, arguments);
        data.single = this.single;
        console.dir(data.single);
        return data;
      }/*,
      templateHelpers:  {
        isSingle: function(){
          return this.single
        }

      }*/
    });

    Common.Thumbnails = CompositeView.extend({
      template: thumbnailsTpl,
      childView: Common.Thumbnail,
      childViewContainer: 'div.thbs',
      initialize: function() {
        this.single = this.options.single
      },
      childViewOptions: function(model, index) {
         return {
            single: this.options.single
         }
      }
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
        var list = new options.mainView({
          collection: this.collection
        });

        var self = this;
        _.each(eventsToPropagate, function (evt) {
          self.listenTo(list, evt, function (view, model) {
            //Слушем событие от compositeView и передаем ее tracks listController'у
            self.trigger(evt, view, model);
          });
        });

        this.on("show", function () {
          this.paginationMainRegion.show(list);
        });

        if(options.pager) {
          var pageControls = new Common.PaginationControls({
            paginatedCollection: this.collection,
            urlBase: options.paginatedUrlBase
          });
          this.listenTo(pageControls, "page:change", function (page) {
            self.trigger("change:page", page);
          });
          self.on('show', function() {
            self.paginationControlsRegion.show(pageControls);
          })
        }
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