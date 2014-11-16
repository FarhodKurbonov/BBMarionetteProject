define(['app',
  'libs/views/_base/ItemView',
  'libs/views/_base/CompositeView',
  'libs/views/_base/LayoutView',
  'tpl!apps/artists/list/templates/layout.tpl',
  'tpl!apps/artists/list/templates/_letterItem.tpl',
  'tpl!apps/artists/list/templates/_letters.tpl',
  'tpl!apps/artists/list/templates/_artistItem.tpl',
  'tpl!apps/artists/list/templates/_artists.tpl',
  'tpl!apps/artists/list/templates/panelTpl.tpl',
  'tpl!apps/artists/list/templates/empty.tpl',
  'libs/behaviors/behaviors'

],function(App,/*Views*/ ItemView, CompositeView, LayoutView,/*Templates*/ layoutTpl, letterItemTpl, lettersTpl,  artistItemTpl, artistsList, panelTpl, emptyTpl) {
  App.module("ArtistsApp.List", function (List, App, Backbone, Marionette, $, _) {
    List.Empty = ItemView.extend({
      template: emptyTpl,
      tagName: 'tr',
      class: 'alert'
    });
    List.Panel = ItemView.extend({
      template: panelTpl,
      triggers: {
        'click button.js-new': 'artist:new'
      },
      events: {
        'submit #filter-form': 'filterArtists'
      },
      ui: {
        criterion: 'input.js-filter-criterion'
      },
      modelEvents: {
        'change': 'render'
      },

      filterArtists: function (event){
        event.preventDefault();
        var criterion = this.$('.js-filter-criterion').val();
        this.trigger('artists:filter', criterion);
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
      className: 'container artists-page',
      regions: {
        catalogRegion       : "#catalog-region",
        contentHeaderRegion : "#content-header-region",
        panelRegion         : "#panel-region",
        artistsRegion       : "#artists-region"
      }
    });
    /**
     * Элемент списка
     * @type {Object.<Marionette.ItemView>}
     * @extends {App.Views.ItemView}
     */
    List.Letter = ItemView.extend({
      tagName: 'li',
      className: 'label',
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
     * Генерит вид состоящий из списка
     * @type {Object.<Marionette.CompositeView>}
     * @extends {App.Views.CompositeView}
     */
    List.Letters = CompositeView.extend({
      template: lettersTpl,
      className: 'row',
      childView: List.Letter,
      childViewContainer: 'ul'
    });

    List.Artist  = ItemView.extend({
      tagName: 'tr',
      template: artistItemTpl,
      events: {
        'click td a.js-edit': 'editClicked'
      },
      triggers: {
        "click td a.js-show": {
          stopPropagation: true
        }
      },
       behaviors: {
         Confirmable: {
           event: 'artist:delete',
           message: function (view) {
            return 'Удалить ' + view.model.get('name') + '?';
           }
         }
       }
    });
    _.extend(List.Artist.prototype, {
      remove: function () {
        var self = this;
        this.$el.fadeOut(function () {
          Marionette.ItemView.prototype.remove.call(self)
        })
      },
      editClicked: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger('artist:edit', this.model);
      }
    });

    List.Artists = CompositeView.extend({
      tagName: 'div',
      className: 'table',
      template: artistsList,
      emptyView: List.Empty,
      childView: List.Artist,
      childViewContainer: 'tbody',

      initialize: function () {
        this.listenTo(this.collection, 'reset', function () {
          this.appendHtml = function (collectionView, itemView, index) {
            collectionView.$el.append(itemView.el)
          }
        })
      },

      onCompositeCollectionRendered: function () {
        this.appendHtml = function (collectionView, itemView, index) {
          collectionView.$el.prepend(itemView.el);
        }
      }
    });

  });
  return App.ArtistsApp.List;
});