define([
  'app',
  'entities/_base/model',
  'entities/_base/collection',
  'iosync',
  'validation',
  'paginator'
], function(App, Model, Collection) {
  App.module("Entities", function (Entities, App, Backbone, Marionette, $, _) {
    function chunkModels(models){
      var chunk = models.groupBy(function(model){
        return model.get('name').charAt(0).toLowerCase();
      });
      var alphabeth = [];
      var letterName= 'letter';
      var listOfNestedModels = 'list';
      for(var key in chunk){
        var obj = {};
        obj[letterName] = key;
        obj[listOfNestedModels] = chunk[key];
        alphabeth.push(obj);
      }
      return alphabeth;
    }
    Entities.Track = Model.extend({
      urlRoot: 'tracks',
      initialize: function () {
      },
      defaults: {
        name         : '',
        artistId     : '',
        url          : '',
        uploadUserId : '',
        likeVSdislike: '',
        duration     : '',
        bitRate      : '',
        size         : '',
        downloadCount: '',
        Pl_UserId    : '',
        listenCount  : 0,
        type         : '',
        quality      : '',
        vocal        : null,
        songText     : '',
        youTubeLink  : '',
        changedOnServer: false,
        trackName    : ''
      }
    });

    _.extend(Entities.Track.prototype, Backbone.Validation.mixin, {
      validation: {
        name: {
          required: true,
          minLength: 3,
          msg: 'Слишком короткий(мин. 3 символа)'
        }
      }
    });

    Entities.Tracks = Collection.extend({
      model: Entities.Track,
      url: 'tracks',
      comparator: function (a, b) {
        var aLetter = a.get('letter');
        var bLetter = b.get('letter');
        return (aLetter < bLetter) ? -1 : 1
      }
    });

    var API = {
      getTrackEntities: function (options) {

        var tracks = new Entities.Tracks();

        var defer = $.Deferred();

        options || (options = {});
        var track = new Entities.Track({id: options.id});
        tracks.url = track.url();
        options.reset = true;
        defer.then(options.success, options.error);

        var response = tracks.fetch(_.omit(options, 'success', 'error'));
        response.done(function () {
          var chunkedTracks = chunkModels(tracks);
          chunkedTracks = new Entities.Tracks(chunkedTracks);
          chunkedTracks.each(function(letter){
            var tracks = letter.get('list');
            var tracksCollection = new Entities.Tracks(tracks);
            letter.set('list', tracksCollection);
          });
          console.log(tracks);
          console.log(chunkedTracks);
          defer.resolveWith(response, [chunkedTracks]);
        });

        response.fail(function () {
          defer.rejectWith(response, arguments);
        });
        return defer.promise();
      },
      getTrackEntity: function (contactId, options) {
        var contact = new Entities.Artist({id: contactId});
        var defer = $.Deferred();
        options || (options = {});
        defer.then(options.success, options.error);
        var response = contact.fetch(_.omit(options, 'success', 'error'));
        $.when(response)
          .done(function () {
            defer.resolveWith(response, [contact]);
          })
          .fail(function () {
            defer.rejectWith(response, arguments);
          });

        return defer.promise();
      }
    };

    App.reqres.setHandler('tracks:entities', function (options) {
      return API.getTrackEntities(options)
    });

    App.reqres.setHandler('tracks:entity', function (id, options) {
      return API.getTrackEntity(id, options)
    });

    App.reqres.setHandler('track:entity:new', function () {
      return new Entities.Track();
    })
  });
  return;
});