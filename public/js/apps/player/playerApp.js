define(['app', 'apps/player/show/playerController'], function (App, playerController) {

  App.module('PlayerApp', function(PlayerApp, App, Backbone, Marionette, $, _) {

    this.startWithParent = false;

    PlayerApp.onStart = function() {
      API.showPlayer();
      console.info('Start PlayerApp!');
    };

    PlayerApp.onStop = function () {
      console.info('Stop PlayerApp');
      //Destroy PlayerApp.Show.Controller and unbind all events
      playerController.destroy();
      //Clear playerRegion
      App.playerRegion.empty();



    };
    var API = {
      showPlayer: function() {
        playerController.showPlayer();
      }
    };
/*    var theMP3,
      start = false,
      prevTrackID,
      mainRegion =  $('#main-region'),
      playerButton = $('.play-button','#player-region');

    *//**
     * Handler "click" play button
     *//*
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
    *//**
     * Handler for pause button
     *//*
    mainRegion.on('click', 'td i.js-pause', function (e) {
      var id = $(this).attr('data-id');
      $(this).removeClass('js-pause glyphicon-pause').addClass('js-play glyphicon-play-circle');
      $('.play-button','#player-region').find('i.js-pause').removeClass('js-pause glyphicon-pause')
        .addClass('js-play glyphicon-play-circle');
      //start = false;
      pause(id);
    });

    function play(id) {
      theMP3 = playerController.theMP3(id);
      theMP3.play();
    }
    function pause(trackID) {
      theMP3.pause(trackID);
    }
    function stop(prevTrackID) {
      theMP3.unload(prevTrackID);
    }*/
  });
  return App.PlayerApp;

});