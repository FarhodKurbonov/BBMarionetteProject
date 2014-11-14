var express = require('express');
var HomeController = require('../controllers/HomeController');
var DownloadController = require('../controllers/DownloadController');


module.exports = function(app) {

  app.get('/download/:id', function(req, res, next) {
      DownloadController.run(req, res, next);
  });
  app.get('/',function(req, res, next) {
    HomeController.run(req, res, next);
  });



  /*var User = require('models/user').User;
   app.get('/users', function(req, res, next) {

   User.find({}, function(err, users) {
   if(err) return next(err);
   res.json(users);
   });
   });

   app.get('/users/:id', function(req, res, next) {
   try {
   var id = new ObjectID(req.params.id);
   } catch (e) {
   return next(404)
   }

   User.findById(id, function(err, user) {
   if(err) { return next(err)}
   if(!user) {
   next(new HttpError(404, 'User not found'))
   }
   res.json(user);
   })


   });
   app.use('/visit', function(req, res, next) {
   req.session.CounterVisits = req.session.CounterVisits +1 || 1;
   res.send("Visits:" + req.session.CounterVisits)
   });
   */
};

