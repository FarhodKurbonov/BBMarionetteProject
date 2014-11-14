define([
  'app',
  'libs/views/commonView',
  'libs/controllers/ApplicationController',
  'apps/landing/list/listView'


], function (App, ViewsCommon, Controllers, View) {

  App.module('LettersApp.List', function(List, App, Backbone, Marionette, $, _) {
    /**
     * @type {Object.<Marionette.Controller>}
     * @extends {App.Controllers.Application}
     */
   var  controller =  Controllers.extend({
      listLetters: function() {
        //Ожидание заргрузки
        var loadingView = new ViewsCommon.Loading();
        App.mainRegion.show(loadingView);
        //подгружаем все буквы
        require(['entities/letter'], function() {
          var fetchLetters = App.request('letters:entities');

          var lettersListLayout =  new View.Layout();
          var searchForm        =  new View.Search();
          var self              = List.Controller;
          $.when(fetchLetters)
            .done(function(letters){
              /**
               * Вложенный вид
               * @type {Object.<Marionette.LayoutView>} RuEnView
               *
               */
              var lettersListView = new ViewsCommon.RuEnView({
                collection: letters,
                mainView  : View.Letters
              });

              self.listenTo(lettersListLayout, 'show', function() {
                //lettersListLayout.searchRegion.show(searchForm);
                lettersListLayout.lettersRegion.show(lettersListView);
              });

              App.mainRegion.show(lettersListLayout);
            });
        })
      }
    });
    List.Controller = new controller;
  });

  return App.LettersApp.List.Controller
});