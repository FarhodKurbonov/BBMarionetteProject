define(['app',
  'libs/views/_base/ItemView',
  'libs/views/_base/CompositeView',
  'libs/views/_base/LayoutView',
  'tpl!apps/landing/list/template/layout.tpl',
  'tpl!apps/landing/list/template/_search.tpl',
  'tpl!apps/landing/list/template/_letters.tpl',
  'tpl!apps/landing/list/template/_letterItem.tpl'

],function(App,/*Views*/ ItemView, CompositeView, LayoutView,/*Templates*/ layoutTpl, searchTpl, lettersTpl, letterItemTpl) {
  App.module("LettersApp.List", function (List, ContactManager, Backbone, Marionette, $, _) {
    /**
     * Главный лейаут
     * @type {Object.<Marionette.LayoutView>}
     * @extends {App.Views.LayoutView}
     */
    List.Layout = LayoutView.extend({
      template: layoutTpl,
      regions: {
        searchRegion  : "#search-region",
        lettersRegion: "#letters-region"
      }
    });
    /**
     * Строка поиска
     * @type {Object.<Marionette.ItemView>}
     * @extends {App.Views.ItemView}
     */
    List.Search = ItemView.extend({
      template: searchTpl,
      events: {
        'submit #search-form': 'searchTracks'
      },
      /**
       * Применяется чтобы можно было ссылатся через this.ui[refNamev]
       * Например оно используется в
       * onSetSearchCriterion->this.ui.searchCriterion.val(criterion);
       */
      ui: {
        searchCriterion: 'input.js-search-criterion'
      },
      /**
       * @event
       * @param {event.<submit>} e
       */
      searchTracks: function (e) {
        e.preventDefault();
        var criterion = this.$('.js-search-criterion').val();
        this.trigger('tracks:search', criterion);
      },

      onSetSearchCriterion: function (criterion) {
        this.ui.searchCriterion.val(criterion);
      }

    });
    /**
     * Элемент списка
     * @type {Object.<Marionette.ItemView>}
     * @extends {App.Views.ItemView}
     */
    List.Letter = ItemView.extend({
      tagName: 'li',
      className: 'label label-success',
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
        e.preventDefault();
        e.stopPropagation();
        this.highlight('label-warning');
        this.trigger('artists:list', this.model);
      }
    });
    /**
     * Генерит вид состоящий из списка
     * @type {Object.<Marionette.CompositeView>}
     * @extends {App.Views.CompositeView}
     */
    List.Letters = CompositeView.extend({
      className: 'row',
      template: lettersTpl,
      childView: List.Letter,
      childViewContainer: 'ul'
    });

  });
  return App.LettersApp.List;
});