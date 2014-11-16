define([
  'app',
  'libs/controllers/ApplicationController',
  'scroller',
  'apps/player/show/sm2',
  'apps/player/show/playerView',
  'affix',
  'jquery-ui'

], function (App, Controllers, $jScroller, soundManager, View) {

  App.module('PlayerApp.Show', function(Show, App, Backbone, Marionette, $, _) {

   var Controller =  Controllers.extend({

     showPlayer: function () {

       var playerView = new View.PlayerPanel;
       App.playerRegion.show(playerView, {reset: true});
       //Show progressBar
       $( "#progressbar" ).progressbar({
         value: 0
       });
       $(".player-wrap").affix({
         offset: {
           top: 50
         }
       });
       //Show volumeBar
       $(".js-volume").slider({
         animate: true,
         min: 0,
         max: 100,
         value: 50
       });

       //Init $jScroller
       $jScroller.cache.init = true;
       $jScroller.config.refresh = 300;
       $jScroller.add(".scroller-container","#scroller","left",2);

       var theMP3,
         self = this,
         start = false,
         prevTrackID,
         mainRegion =  $('#main-region'),
         playerButton = $('.play-button','#player-region');

       /**
        * Handler "click" play button
        */
       mainRegion.on('click', 'td i.js-play', function(e) {
         var id = $(this).attr('data-id');

         //if previous track was started
         if( start === true && id != prevTrackID ){
           // change play icon to pause and also js-pause to js-play
           $(this).addClass('glyphicon-pause');
           $('.media-list').find('.js-pause')
             .removeClass('js-pause glyphicon-pause')
             .addClass('js-play glyphicon-play-circle');
           $('.play-button','#player-region').find('i.js-pause').removeClass('js-pause glyphicon-pause')
             .addClass('js-play glyphicon-play-circle');

           //and stop loading file
           stop(prevTrackID);
         }
         //Change style
         $(this).removeClass('js-play glyphicon-play-circle')
           .addClass('glyphicon-pause js-pause');
         $('.play-button','#player-region').find('i.js-play').removeClass('js-play glyphicon-play-circle')
           .addClass('glyphicon-pause js-pause');
         //Save state that  track was start to playing
         start = true;
         prevTrackID = id;
         $(this).data('prevTrack', id);
         play(id);

       } );
       /**
        * Handler for pause button
        */
       mainRegion.on('click', 'td i.js-pause', function (e) {
         var id = $(this).attr('data-id');
         $(this).removeClass('js-pause glyphicon-pause').addClass('js-play glyphicon-play-circle');
         $('.play-button','#player-region').find('i.js-pause').removeClass('js-pause glyphicon-pause')
           .addClass('js-play glyphicon-play-circle');
         //start = false;
         pause(id);
       });

       function play(id) {
         theMP3 = self.theMP3(id);
         theMP3.play();
       }
       function pause(trackID) {
         theMP3.pause(trackID);
       }
       function stop(prevTrackID) {
         theMP3.unload(prevTrackID);
       }
     },

     volume: 50,
     theMP3: function (id) {
         var self = this;
         return soundManager.createSound({
         id: id,
         url: "download/"+id,
         volume: this.volume,
         onload: function () {
           $(".js-volume").on('slide', function(event, ui) {
             soundManager.setVolume(id, ui.value);
             self.volume = ui.value
           });
           console.info(this.id3["TPE1"]);
         },
         whileplaying: function(){
            //initial data
            var duration = this.duration;
            //console.warn(duration);
            var pos = this.position;
           //console.info(pos);
            var songPosition = (pos/duration)*100;
            //console.log(songPosition);
            $( "#progressbar" ).progressbar( "option", "value", songPosition);
           //Calculate time of playing
            var time = pos/1000;
            var min = Math.floor(time/60);
            var minDisplay = (min<10) ? "0"+min : min;
            var sec = Math.floor(time%60);
            var secDisplay = (sec<10) ? "0"+sec : sec;
            var amountPlayed = minDisplay+":"+secDisplay;

            //Display calculated time
            $("#time").text(amountPlayed);


         },

         onid3: function() {
           var artist = this.id3["TPE1"];
           var title  = this.id3["TIT2"];
           console.info('Artist: %s, Title %s', artist, title);
           self.updateSong({theArtist:artist,theTitle:title});
         },

         //При заканчивании текущего трека запускаем следующий
         // При условии если первый запущен из плейлиста
         onfinish:function() {

           /*                  //Если трек запускается из внутри плейлиста
            //То запустить следующий трек
            if(pl) {
            //Увеличиваем счетчик
            self.Vars.curSong++;
            // Считываем информацию из параметра data-id следуещего dom элемента
            var id = $('.playlist').next().attr('data-id');
            self.playTrack({id: id, playList: true});
            self.updateArtist();
            }

            //Сохраняем id трека для того чтобы
            // было возможность повторного проигрываения
            // из панели управления плеера
            $("#play_btn").data('trackId', id);*/

         }, 
         onstop: function () {

         }
       })
     },

     updateSong: function(options){

        $jScroller.stop();
        $("#scroller p").text( options.theArtist + " : " + options.theTitle );
        $jScroller.reset();
        $jScroller.add(".scroller-container","#scroller","left",2);
        var t=setTimeout($jScroller.start, 2000);
      },
     onBeforeDestroy: function () {
       soundManager.reboot();
       console.warn('Destroy playerController');
     }

   });

    console.info('create PlayerApp.Show.Controller');
    Show.Controller = new Controller;
 });

  return App.PlayerApp.Show.Controller
});