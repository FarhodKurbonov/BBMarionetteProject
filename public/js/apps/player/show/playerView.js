define(['app',
  'libs/views/_base/ItemView',
  'tpl!apps/player/show/templates/playerView.tpl',
  'jquery-ui'
],function(App,/*Views*/ ItemView, playerPanelTpl) {
  App.module("PlayerApp.Show", function (Show, App, Backbone, Marionette, $, _) {
    Show.PlayerPanel = ItemView.extend({
      //className: 'container',
      template: playerPanelTpl,
      className: 'row player-wrap',
      events: {
/*        'click div.control-buttons-block i.js-play': 'playClicked',
        'click div.control-buttons-block i.js-pause': 'pauseClicked',
        'click div.control-buttons-block i.js-stop': 'stopClicked',
        'click div.control-buttons-block i.js-fwd': 'forwardClicked',
        'click div.control-buttons-block i.js-back': 'backClicked',
        'mousemove div.info-block div.js-volume': 'changeVolume'*/
      }
/*      triggers: {
        'click button.js-new': 'track:new'
      },
      modelEvents: {
        'change': 'render'
      },

      filterTracks: function (event) {
        event.preventDefault();
        var criterion = this.$('.js-filter-criterion').val();
        this.trigger('tracks:filter', criterion);
      },
      onSetFilterCriterion: function (criterion) {
        this.ui.criterion.val(criterion);
      }*/

    });
   /* _.extend(Show.PlayerPanel.prototype, {
      remove: function () {
        var self = this;
        this.$el.fadeOut(function () {
          Marionette.ItemView.prototype.remove.call(self)
        })
      }
*//*      playClicked: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var play = function () {
          var self = this,
            playBtn = self.Vars.playBtn;

          playBtn.click(function(){
            if(playBtn.hasClass("play-unselected")){
              playBtn.toggleClass('play-unselected', 'play-selected');
              //Если трек уже проигрывался, то запустить трек заново
              if(playBtn.data('trackId')){
                self.playTrack({id: playBtn.data('trackId'), playList: false});
                self.scroller.start();
              }
            }
          }).mouseover(function(){
              playBtn.css("cursor","pointer");
            });
        };
      },
      pauseClicked: function(e) {
        //e.preventDefault();
        e.stopPropagation();
        //alert('Download clicked');
      },
      stopClicked: function (e) {
        //e.preventDefault();
        e.stopPropagation();
        this.trigger('track:play', this.model);
      },
      forwardClicked: function (e) {
        //e.preventDefault();
        e.stopPropagation();
        this.trigger('track:play', this.model);
      },
      backClicked: function (e) {
        //e.preventDefault();
        e.stopPropagation();
        this.trigger('track:play', this.model);
      },
      changeVolume: function (e) {
        //e.preventDefault();
        e.stopPropagation();
        this.trigger('track:play', this.model);
      }*//*
    });*/


  });

  return App.PlayerApp.Show
});