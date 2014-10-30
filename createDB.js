var mongoose = require('libs/mongoose'),
  async = require('async'),
  log = require('libs/log')(module),
  faker = require('faker'),
  ObjectID = require('mongodb').ObjectID,
  Letter = require('models/letter').Letter,
  Artist = require('models/artist').Artist;
  Track = require('models/track').Track;


  mongoose.set('debug', true);

async.series([
  open,
  dropDatabase,
  requireModels,
  createLetter,
  createArtist,
  createTrack
], function(err) {
  mongoose.disconnect();
  process.exit(err ? 255 : 0);
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function requireModels(callback) {


  async.each(Object.keys(mongoose.models), function(modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function createLetter(callback) {

  var letters = [
                {letter: 'a'}, {letter: 'b'}, {letter: 'c'}, {letter: 'd'},
                {letter: 'e'}, {letter: 'f'}, {letter: 'g'}, {letter: 'h'},
                {letter: 'i'}, {letter: 'j'}, {letter: 'k'}, {letter: 'l'},
                {letter: 'm'}, {letter: 'n'}, {letter: 'o'}, {letter: 'p'},
                {letter: 'q'}, {letter: 'r'}, {letter: 's'}, {letter: 't'},
                {letter: 'u'}, {letter: 'v'}, {letter: 'w'}, {letter: 'x'},
                {letter: 'y'}, {letter: 'z'}, {letter: '0..9'},

                {letter: 'а'}, {letter: 'б'}, {letter: 'в'}, {letter: 'г'},
                {letter: 'д'}, {letter: 'е'}, {letter: 'ж'},{letter: 'з'},
                {letter: 'и'}, {letter: 'к'}, {letter: 'л'}, {letter: 'м'},
                {letter: 'н'}, {letter: 'о'}, {letter: 'п'}, {letter: 'р'},
                {letter: 'с'}, {letter: 'т'}, {letter: 'у'}, {letter: 'ф'},
                {letter: 'х'}, {letter: 'ц'}, {letter: 'ч'}, {letter: 'ш'},
                {letter: 'щ'}, {letter: 'э'}, {letter: 'ю'}, {letter: 'я'}
  ];

  async.each(letters, function(letterData, callback) {
    var letter = new mongoose.models.Letter(letterData);
    letter.save(callback);
  }, callback);
}

function createArtist(callback) {

    var artists = [];
    for(var i = 0; i < 300; i++ ) {
      var artist = {};
      artist.name = faker.Name.findName();
      artist.createdAt = new Date();
      artist.avatar = faker.Image.avatar();
      artists.push(artist);
    }

    async.each(artists, function(artistData, callback) {
      async.series([
        function(callback) {
          var firstChar = artistData.name.charAt(0).toLowerCase();
          Letter.findOne({letter: firstChar}).exec(function(err, res) {
            if(err) callback(err);
            res = res.toObject().id;
            callback(null, res);
          });
        }
      ],function(err, result) {
        artistData.letterId = result[0];
        var artist = new mongoose.models.Artist(artistData);
        artist.save(callback);
      });
    }, callback);


}

function createTrack(callback) {

  async.waterfall([
    function(callback) {
      Artist.find({}).exec(function(err, results) {
        if(err) callback(err);
        results = results.map(function(artist) {
          return artist.toObject().id;
        });
        callback(null, results);
      });
    },
    function(artistsID, callback) {

      async.each(artistsID, function(artistID, callback) {
        var tracks = [];
        for(var i = 0 ; i < 30; i++ ) {
          var trackData = {};
          trackData.name = faker.Name.findName();
          trackData.artistId = new ObjectID(artistID);
          tracks.push(trackData);
        }
        async.each(tracks, function(trackData, callback) {
          var track = new mongoose.models.Track(trackData);
          track.save(callback);
        }, callback);

      }, callback);
    }
  
  ],function (err, result) {
      if(err) {
        log.error('error');
        callback(err);
      }
       log.info('success');
        callback(result);

  });

}

