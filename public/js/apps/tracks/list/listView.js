define(['app',
  'libs/views/_base/ItemView',
  'libs/views/_base/CompositeView',
  'libs/views/_base/LayoutView',
  'libs/views/_base/CollectionView',
  'tpl!apps/tracks/list/templates/layout.tpl',
  'tpl!apps/tracks/list/templates/_letterItem.tpl',
  'tpl!apps/tracks/list/templates/_letters.tpl',
  'tpl!apps/tracks/list/templates/_trackItem.tpl',
  'tpl!apps/artists/list/templates/_artists.tpl',
  'tpl!apps/tracks/list/templates/panelTpl.tpl',
  'tpl!apps/tracks/list/templates/_tracks.tpl',
  'tpl!apps/tracks/list/templates/_empty.tpl',
  'libs/behaviors/behaviors'

],function(App,/*Views*/ ItemView, CompositeView, LayoutView, CollectionView,/*Templates*/ layoutTpl, letterItemTpl, lettersTpl,  trackItemTpl, artistsList, panelTpl, tracksTpl, emptyTpl) {
  App.module("TracksApp.List", function (List, App, Backbone, Marionette, $, _) {
    List.Empty = ItemView.extend({
      template: emptyTpl,
      tagName: 'tr',
      class: 'alert'
    });

    List.Panel = ItemView.extend({
      template: panelTpl,
      triggers: {
        'click button.js-new': 'track:new'
      },
      modelEvents: {
        'change': 'render'
      },

      filterTracks: function (event) {
        event.preventDefault();
        var criterion = this.$('.js-filter-criterion').val();
        this.trigger('tracks:filter', criterion);
      },
      onSetFilterCriterion: function (criterion) {
        this.ui.criterion.val(criterion);
      }

    });
    /**
     * Главный лейаут
     * @type {Object.<Marionette.LayoutView>}
     * @extends {App.Views.LayoutView}
     */
    List.Layout = LayoutView.extend({
      template: layoutTpl,
      className: 'container',
      regions: {
        leftBarRegion       : "#leftbar-region",
        contentHeaderRegion : "#content-header-region",
        panelRegion         : "#panel-region",
        tracksRegion       :  "#tracks-region"
      }
    });
    /**
     * Элемент списка
     * @type {Object.<Marionette.ItemView>}
     * @extends {App.Views.ItemView}
     */
    List.Letter = ItemView.extend({
      tagName: 'li',
      template: letterItemTpl,

      events: {
        'click a.js-show': 'showClicked'
      }
    });
    _.extend(List.Letter.prototype, {
      /**
       * @event
       * @param {event.<click>} e
       * @export
       */
      showClicked: function (e) {
        e.stopPropagation();
        this.highlight('label-warning');
      }
    });
    /**
     * Генерит вид состоящий из списка букв
     * @type {Object.<Marionette.CompositeView>}
     * @extends {App.Views.CompositeView}
     */
    List.Letters = CompositeView.extend({
      template: lettersTpl,
      childView: List.Letter,
      childViewContainer: 'ul'
    });

    List.Track  = ItemView.extend({
      tagName: 'tr',
      template: trackItemTpl,
      events: {
        'click td a.js-edit': 'editClicked'
      },
      triggers: {
        "click td a.js-show": {
          event: "track:show",
          preventDefault: true,
          stopPropagation: true
        }
      },
       behaviors: {
         Confirmable: {
           event: 'track:delete',
           message: function (view) {
            return 'Удалить ' + view.model.get('name') + '?';
           }
         }
       }
    });
    _.extend(List.Track.prototype, {
      remove: function () {
        var self = this;
        this.$el.fadeOut(function () {
          Marionette.ItemView.prototype.remove.call(self)
        })
      },
      editClicked: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger('track:edit', this.model);
      }
    });

    List.Tracks = CompositeView.extend({
      template: tracksTpl,
      className: 'media',
      tagName: 'li',
      childView: List.Track,
      childViewContainer: 'tbody',
      initialize: function () {
        this.collection = this.model.get('list');
        this.listenTo(this.collection, 'reset', function () {
          this.appendHtml = function (collectionView, itemView, index) {
            collectionView.$el.append(itemView.el)
          }
        });
        /**
         * Ловим событие itemView и "поднимаем его" до layoutView
         * он же в свою очередь передает это событе ListController'у который
         * ловит событие 'childview:track:edit'
         * Для compositeView это событие ребенка поэтому он слушает событие префиксоа childview
         */
        this.on('childview:track:edit', function(view, model){
          this.trigger('track:edit',{itemView: view, itemModel: model});//это событие ловит ContentMain
        });
        this.on('childview:track:delete', function(view, model) {
          this.trigger('track:delete', {itemView: view, itemModel: model});//это событие ловит ContentMain
        });

      },
      onCompositeCollectionRendered: function () {
        this.appendHtml = function (collectionView, itemView, index) {
          collectionView.$el.prepend(itemView.el);
        }
      }
    });

    List.Outer = CollectionView.extend({
      className: 'media-list',
      tagName: 'ul',
      emptyView: List.Empty,
      childView: List.Tracks
    });

  });
  return App.TracksApp.List;
});