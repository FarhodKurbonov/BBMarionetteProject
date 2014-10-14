var mongoose = require('libs/mongoose'),
  async = require('async'),
  log = require('libs/log')(module),
  faker = require('faker'),
  ObjectID = require('mongodb').ObjectID;

mongoose.set('debug', true);

async.series([
  open,
  dropDatabase,
  requireModels,
  createLetters
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
  require('models/letter');

  async.each(Object.keys(mongoose.models), function(modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

/*function createContacts(callback) {
  var contacts = [];

  for(var i = 0; i < 50; i++ ) {
    var contact = {};
    contact.firstName = faker.Name.firstName();
    contact.lastName = faker.Name.lastName();
    contact.phone = faker.PhoneNumber.phoneNumber();
    contacts.push(contact);
  }

  async.each(contacts, function(contactData, callback) {
    var contact = new mongoose.models.Contact(contactData);
    contact.save(callback);

  }, callback);

}*/
function createLetters(callback) {

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
    {letter: 'и'}, {letter: 'й'}, {letter: 'к'}, {letter: 'л'},
    {letter: 'м'}, {letter: 'н'}, {letter: 'о'}, {letter: 'п'},
    {letter: 'р'}, {letter: 'с'}, {letter: 'т'}, {letter: 'у'},
    {letter: 'ф'}, {letter: 'х'}, {letter: 'ц'}, {letter: 'ч'},
    {letter: 'ш'}, {letter: 'щ'}, {letter: 'ы'}, {letter: 'э'},
    {letter: 'ю'}, {letter: 'я'}

  ];
  async.each(letters, function(letterData, callback) {
    var letter = new mongoose.models.Letter(letterData);
    letter.save(callback);
  }, callback);
}