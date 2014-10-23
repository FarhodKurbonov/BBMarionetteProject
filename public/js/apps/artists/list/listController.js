define([
  'app',
  'libs/views/commonView',
  'libs/controllers/ApplicationController',
  'apps/artists/list/listView'
], function (App, ViewsCommon, Controllers, View) {

  App.module('ArtistsApp.List', function(List, App, Backbone, Marionette, $, _) {
    /**
     * @type {Object.<Marionette.Controller>}
     * @extends {App.Controllers.Application}
     */
   var  Controller =  Controllers.extend({
      listArtists: function(options) {
        //Ожидание заргрузки
        var loadingView = new ViewsCommon.Loading();
        App.mainRegion.show(loadingView);
        //подгружаем все буквы
        require(['entities/artist', 'entities/letter'], function() {
          var fetchArtists = App.request('artists:entities', options);
          var Layout =  new View.Layout();
          var panel  =  new View.Panel();
          var self   = List.Controller;

          $.when(fetchArtists)
            .done(function(artists){
              var fetchLetters = App.request('letters:entities');
              $.when(fetchLetters)
                .done(function(letters) {
                  console.dir(artists);
                  console.dir(letters);
                  if (options.criterion) {
                    artists.parameters.set({criterion: options.criterion});
                    panel.once('show', function () {
                      panel.triggerMethod('set:filter:criterion', options.criterion);
                    });
                  }


                  var lettersListView = new ViewsCommon.RuEnView({
                    collection: letters,
                    mainView  : View.Letters
                  });
                  var contentHeader = new ViewsCommon.ContentHeader({
                    //letter       : artists.models.get('letter'),
                    //famousArtists: artists.models.slice(0, 7)
                  });
                  artists.goTo(options.page);
                  var contentMain = new ViewsCommon.ContentMain({
                    collection: artists,
                    mainView  : View.Artists,
                    paginatedUrlBase: 'artists/'+options.firstLetter+'filter/',
                    propagatedEvents: [
                      'childview:artist:edit',
                      'childview:artist:delete'

                    ]
                  });

                  self.listenTo(panel, 'artists:filter', function (filterCriterion) {
                    /**
                     * Если произошла фильтрация то установить pagination control на страницу 1
                     */
                    artists.parameters.set({ page: 1, criterion: filterCriterion, letter: options.firstLetter});
                    App.trigger('artists:filter', _.clone(artists.parameters.attributes));
                  });

                 self.listenTo(contentMain, 'childview:artist:delete', function (childView, model) {
                  model.model.destroy();//тоже самое что models.collection.remove(models)
                 });

                  self.listenTo(Layout, 'show', function() {
                    Layout.leftBarRegion.show(lettersListView);
                    Layout.contentHeaderRegion.show(contentHeader.render());
                    Layout.panelRegion.show(panel);
                    Layout.artistsRegion.show(contentMain);
                  });
                  /* self.listenTo(contactsListPanel, 'contact:new', function () {
                    require(['apps/contacts/new/newView'], function (ContactsAppNew) { //Creating empty models
                        var newContact = ContactManager.request('contact:entity:new');

                        var view = new ContactsAppNew.Contact({
                          model: newContact
                        });

                        self.listenTo(view, 'form:submit', function (data) {
                          var contactSaved = newContact.save(data);
                          if (contactSaved) {
                            $.when(contactSaved)
                              .done(function () {
                                contacts.add(newContact);
                                view.trigger('dialog:close');
                                var newContactView = contactsListView.children.findByModel(newContact);
                                if (newContactView) {
                                  newContactView.flash('success')
                                }
                              })
                              .fail(function (response) {
                                if (response.status === 422) {
                                  console.log('Произошла ошибка: ', response);
                                  view.triggerMethod('form:data:invalid', response.errors);
                                }
                              });
                          } else {
                            view.triggerMethod('form:data:invalid', newContact.validationError)
                          }

                        });
                        ContactManager.dialogRegion.show(view);
                      }
                    )
                  });*/
                  /*self.listenTo(contactsListView, 'childview:contact:edit', function (childView, model) {

                    require( ['apps/contacts/edit/editView'], function (editView) {
                      var view = new editView.Contact({
                        model: model
                      });

                      view.on('form:submit', function (data) {
                        model.set(data, {silent: true});
                        var upduateModel = model.save(data, {wait: true});

                        if (upduateModel) {
                          view.onBeforeDestroy = function () {
                            model.set({changedOnServer: false});
                          };
                          $.when(upduateModel)
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
                                var keys = ['firstName', 'lastName', 'phone'];
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

                      ContactManager.dialogRegion.show(view)
                    })
                  });*/
                  

                  App.mainRegion.show(Layout);
                });


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
    List.Controller.listenTo(App.ArtistsApp, 'stop', function() {
      List.Controller.destroy();    
    });
  });

  return App.ArtistsApp.List.Controller
});