define([
  'app',
  'libs/views/commonView',
  'libs/controllers/ApplicationController'


], function (App, ViewsCommon, Controllers) {

  App.module('LettersApp.List', function(List, App, Backbone, Marionette, $, _) {
   var  controller =  Controllers.extend({
      listLetters: function() {
        require(['entities/letter'], function() {
          var fetchLetters = App.request('letters: entities');
          $.when(fetchLetters)
            .done(function(letters){
              var loadingView = new ViewsCommon.Loading();
              App.mainRegion.show(loadingView);
              console.dir(letters);
            });
        })
      }
    });
    List.Controller = new controller;
  });

  return App.LettersApp.List.Controller
});