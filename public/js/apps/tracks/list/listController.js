define([
  'app',
  'libs/views/commonView',
  'libs/controllers/ApplicationController',
  'apps/tracks/list/listView',
  'affix'
], function (App, ViewsCommon, Controllers, View) {

  App.module('TracksApp.List', function(List, App, Backbone, Marionette, $, _) {
    /**
     * @type {Object.<Marionette.Controller>}
     * @extends {App.Controllers.Application}
     */
   var  Controller =  Controllers.extend({
      listTracks: function(options) {
        //Ожидание загрузки
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

          $.when(fetchArtist, fetchLetters, fetchTracks).done(function(artist, letters, tracks) {

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
                'childview:track:edit',
                'childview:track:delete',
                'childview:track:play'
              ]
            });

            self.listenTo(contentMain, 'childview:track:delete', function (childView, options) {
              var model = options.itemModel;
              childView = options.itemView;
              model.model.destroy();//тоже самое что models.collection.remove(models)
            });

            self.listenTo(Layout, 'show', function() {
              Layout.leftBarRegion.show(lettersListView);
              Layout.contentHeaderRegion.show(contentHeader);
              Layout.panelRegion.show(panel);
              Layout.tracksRegion.show(contentMain);
            });

            self.listenTo(panel, 'track:new', function () {
            require(['apps/tracks/new/newView',
                     'tpl!apps/tracks/new/templates/uploadForm.tpl'
            ],function (New, uploadFormTpl) {
                var newTrack = App.request('track:entity:new'); //Creating empty models

                var view = new New.Track({
                  template: uploadFormTpl,//Передали шаблон
                  model: newTrack
                });
                /**
                 * Выводим диалоговое окно для загрузки файла, в котором анимированно загружается файл.
                 * После загрузки файла генерится форма нового трека.
                 */
                require([
                        'libs/components/uploader/uploader',
                        'tpl!apps/tracks/new/templates/addNewTrackForm.tpl'
                ], function(Upload, addNewTrackForm) {
                  Upload.startUploadFile(addNewTrackForm);//Запускаем скрипт для загрузки файла
                  self.listenTo(view, 'form:submit', function (data) {
                    data.artistId = options.id;
                    var trackSaved = newTrack.save(data);//Сохраняем данные
                    if (trackSaved) {
                     $.when(trackSaved).done(function () {
                       /**
                        * Так как коллекция tracks у нас вложенная а также сортированная
                        * по алфавиту мы находим модель у которой поле letter
                        * соответствует первой букве названия песни
                        * Далее, в найденной модели есть свойтво list
                        * в ней хранится коллекция туда мы и нашу новую песню сохраняем
                        */
                       var desiredModel = tracks.find(function(model){
                         return model.get('letter') === newTrack.get('name').charAt(0).toLowerCase();
                       });
                       //если такой модели нет то перезагружаем старицу
                       if(!desiredModel) return  window.location.reload(Backbone.history.fragment);
                       desiredModel.get('list').add(newTrack);// Добавляем новый трек
                       view.trigger('dialog:close');
                    }).fail(function (response) {
                      var keys = ['name'];
                      if (response.status === 422) {
                        console.log('Произошла ошибка: ', response);
                        view.triggerMethod('form:data:invalid', response.errors);
                      }
                   });
                   } else {
                   view.triggerMethod('form:data:invalid', newTrack.validationError)
                   }

                   });
                });

                App.dialogRegion.show(view);
              }
            )
          });

            self.listenTo(contentMain, 'childview:track:edit', function (childView, options) {

              require([
                       'apps/tracks/edit/editView',
                       'tpl!apps/tracks/edit/template/editForm.tpl'
              ], function (Edit, extendFormTpl) {
                // Marionette по умолчанию  передает
                // вид первой степени вложенности
                // А у нас вложенный вид второй степени, поэтому
                // через options мы передем самый последний вид вложенности а также модель
                var model = options.itemModel;
                childView = options.itemView;
                var view = new Edit.Track({
                  template: extendFormTpl,
                  model: model
                });
                require([
                         'libs/components/uploader/uploader',
                        'tpl!apps/tracks/edit/template/uploadSuccess.tpl'
                ], function (Upload, uploadSuccessTpl) {
                  Upload.startUploadFile(uploadSuccessTpl);
                  view.on('form:submit', function (data) {
                    model.set(data, {silent: true});
                    var updateModel = options.itemModel.save(data,{wait: true});

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
                           var keys = ['trackName', 'url', 'quality', 'vocal', 'songText', 'youTubeLink', 'name'];
                            model.refresh(response.entity, keys);
                            view.render();
                            //Указываем что поля начинающиеся track нужно отметить ошибками
                            view.triggerMethod('form:data:invalid',{errors:response.errors, field:'#track-'});
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
                });

                App.dialogRegion.show(view)
              });
            });

/*            self.listenTo(contentMain, 'childview:track:play', function(childView, options) {
              var model = options.itemModel;
              childView = options.itemView;

              require([ 'apps/tracks/player/playerController'], function (Player) {
                var id = model.get('id');

                  if(Player.start){
                    var sound = Player.theMP3(id);
                    sound.play();
                    Player.start = false;
                  } else{
                    sound.resume();
                  }

              });

              App.trigger('track:play', model);// Передали управление  tracksApp
            });*/

            App.mainRegion.show(Layout);

            }).fail(function() {
              alert('Произошла непредвиденная ошибка. Попытайтесь перезагрузить сраницу');
            });
        })
      },

      onDestroy: function() {
        console.info('Высвобождаем память занятую TracksApp.List.Controller');
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