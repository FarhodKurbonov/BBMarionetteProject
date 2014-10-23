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
  'libs/behaviors/behaviors'

],function(App,/*Views*/ ItemView, CompositeView, LayoutView,/*Templates*/ layoutTpl, letterItemTpl, lettersTpl,  artistItemTpl, artistsList, panelTpl) {
  App.module("ArtistsApp.List", function (List, ContactManager, Backbone, Marionette, $, _) {
    List.Panel = ItemView.extend({
      template: panelTpl,
      triggers: {
        'click button.js-new': 'contact:new'
      },
      events: {
        'submit #filter-form': 'filterContacts'
      },
      ui: {
        criterion: 'input.js-filter-criterion'
      },
      modelEvnts: {
        'change': 'render'
      },

      filterContacts: function (event) {
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
      className: 'container',
      regions: {
        leftBarRegion       : "#leftbar-region",
        contentHeaderRegion : "#content-header-region",
        panelRegion         : "#panel-region",
        artistsRegion       : "#arists-region"
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
     * Генерит вид состоящий из списка
     * @type {Object.<Marionette.CompositeView>}
     * @extends {App.Views.CompositeView}
     */
    List.Letters = CompositeView.extend({
      template: lettersTpl,
      childView: List.Letter,
      childViewContainer: 'ul'
    });

    List.Artist  = ItemView.extend({
      tagName: 'tr',
      template: artistItemTpl,
      events: {
        /*'click .js-behavior-confirmable': 'remove',*/
        'click td a.js-edit': 'editClicked'
      },
      triggers: {
        "click td a.js-show": {
          event: "contact:show",
          preventDefault: true,
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
      tagName: 'table',
      className: 'table table-hover',
      template: artistsList,
      //emptyView: NoContactsView,
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