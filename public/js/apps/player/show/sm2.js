
define(['soundmanager2'], function (soundManager) {
  console.info('load sm2');
  window.soundManager=soundManager;

  soundManager.setup({
    url: 'js/apps/player/show/swf/',
    flashVersion: 9,
    useHTML5Audio: true,
    preferFlash: true, // prefer 100% HTML5 mode, where both supported
    onready: function() {
    },
    ontimeout: function() {

    },
    defaultOptions: {

      volume: 100
    }
  });

  soundManager.beginDelayedInit();
  return soundManager;
});