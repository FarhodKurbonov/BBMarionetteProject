define([
  'app',
  'libs/views/commonView',
  'libs/controllers/ApplicationController',
  'apps/tracks/list/listView'
], function (App, ViewsCommon, Controllers, View) {

  App.module('TracksApp.List', function(List, App, Backbone, Marionette, $, _) {
    /**
     * @type {Object.<Marionette.Controller>}
     * @extends {App.Controllers.Application}
     */
   var  Controller =  Controllers.extend({
      listTracks: function(options) {
        //Ожидание заргрузки
        var loadingView = new ViewsCommon.Loading();
        App.mainRegion.show(loadingView);
        //подгружаем все буквы и список артистов
        require(['entities/track', 'entities/letter', 'entities/artist'], function() {
          var fetchArtist = App.request('artist:entity', options.id);
          var fetchLetters = App.request('letters:entities');
          var fetchTracks = App.request('tracks:entities', options);
          var Layout =  new View.Layout();
          var panel  =  new View.Panel();
          var self   = List.Controller;

          $.when(fetchArtist, fetchLetters, fetchTracks)
            .done(function(artist, letters, tracks){


              var lettersListView = new ViewsCommon.RuEnView({
                collection: letters,
                mainView  : View.Letters
              });
              var contentHeader = new ViewsCommon.ContentHeader({
                allOrSingleArtist: 'SingleArtist',
                single: true,
                avatar: artist
              });

              var contentMain = new ViewsCommon.ContentMain({
                collection: tracks,
                mainView  : View.Outer,
                pager: false,
                propagatedEvents: [
                  'childview:artist:edit',
                  'childview:artist:delete'

                ]
              });

                  /*self.listenTo(contentMain, 'childview:artist:delete', function (childView, model) {
                  model.model.destroy();//тоже самое что models.collection.remove(models)
                 });*/
                  self.listenTo(Layout, 'show', function() {
                    Layout.leftBarRegion.show(lettersListView);
                    Layout.contentHeaderRegion.show(contentHeader);
                    Layout.panelRegion.show(panel);
                    Layout.tracksRegion.show(contentMain);
                  });

                  self.listenTo(panel, 'track:new', function () {
                  require(['apps/tracks/new/newView'], function (New) {
                      var newTrack = App.request('track:entity:new'); //Creating empty models

                      var view = new New.Artist({
                        model: newArtist
                      });

                      self.listenTo(view, 'form:submit', function (data) {
                        var artistSaved = newArtist.save(data);
                        if (artistSaved) {
                          $.when(artistSaved)
                            .done(function () {
                              artists.add(newArtist);
                              view.trigger('dialog:close');
                            })
                            .fail(function (response) {
                              var keys = ['name'];
                              if (response.status === 422) {
                                console.log('Произошла ошибка: ', response);
                                view.triggerMethod('form:data:invalid', response.errors);
                              }
                            });
                        } else {
                          view.triggerMethod('form:data:invalid', newArtist.validationError)
                        }

                      });
                      App.dialogRegion.show(view);
                    }
                  )
                });

/*                  self.listenTo(contentMain, 'childview:artist:edit', function (childView, model) {
                    require( ['apps/artists/edit/editView'], function (Edit) {
                      var view = new Edit.Artist({
                        model: model
                      });

                      view.on('form:submit', function (data) {
                        model.set(data, {silent: true});
                        var updateModel = model.save(data,{wait: true});

                        if (updateModel) {
                          view.onBeforeDestroy = function () {
                            model.set({changedOnServer: false});
                          };
                          $.when(updateModel)
                            .done(function () {
                              childView.render();
                              delete view.onDestroy;
                              view.trigger("dialog:close");
                              childView.flash('success');
                            })
                            .fail(function (response) {
                              view.onDestroy = function () {
                                model.set(model.previousAttributes());
                              };
                              if (response.status === 422) {
                                var keys = ['name', 'avatar'];
                                model.refresh(response.entity, keys);
                                view.render();
                                view.triggerMethod('form:data:invalid', response.errors);
                                model.set(response.entity, {silent: true});

                              }
                            });
                        } else {
                          view.onDestroy = function () {
                            model.set(model.previousAttributes());
                          };
                          view.triggerMethod('form:data:invalid', model.validationError);
                        }
                      });

                      App.dialogRegion.show(view)
                    })
                  });*/

                  App.mainRegion.show(Layout);



            })
            .fail(function() {
              alert('Произошла непредвиденная ошибка. Попытайтесь перезагрузить сраницу');
            });
        })
      },

      onDestroy: function() {
        console.info('Закрытие контроллера ArtistsApp.List.Controller');
      }
    });
    List.Controller = new Controller;
    //При останове модуля высвобождаем память
    List.Controller.listenTo(App.ArtistsApp, 'stop', function() {
      List.Controller.destroy();    
    });
  });

  return App.TracksApp.List.Controller
});