var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/click');
var http = require('http').Server(router);
var io = require('socket.io')(http);

// Serialize user
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Authenticate on database
passport.use(new LocalStrategy(function(username, password, done) {
  console.log('test');
  process.nextTick(function() {
    db.authenticate(username, password, function() {});
    return true;
  });
}));

// Ensure authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}

// Home page
router.get('/', ensureAuthenticated, function(req, res) {
  var collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs){
    res.render('index', {
      'index': docs
    });
  });
});

// New user page
router.get('/newuser', function(req, res) {
  res.render('newuser', {title: 'Add New User'});
});

// Delete user page
router.get('/deleteuser', function(req, res) {
  res.render('deleteuser', {title: 'Delete New User'});
});

// Login page
router.get('/login', function(req, res) {
  res.render('login', {title: 'Login'});
});

// Chat page
router.get('/chat', function(req, res) {
  res.render('chat', {title: 'Chatroom'});
});

// Create chat connection
io.on('connection', function(socket){
  console.log('new user connected');
  socket.on('chat message', function(msg){
    console.log('mesage: ' + msg);
  });
});

// Post to database
router.post('/adduser', function(req, res) {

  var username = req.body.email;
  var password = req.body.password;

  var collection = db.get('usercollection');

  collection.insert({
    'username': username,
    'password': password
  }, function (err, doc) {
    if (err) {
      res.send('Issue adding to database');
    }
    else {
      res.redirect('/');
    }
  });
});

// Delete from database
router.post('/deleteuser', function(req, res) {

  var username = req.body.email;
  // Add security so that a password is required to delete a user!
  // var password = req.body.password;

  var collection = db.get('usercollection');

  collection.remove({
    'username': username
  }, function(err, doc) {
    if (err) {
      res.send('Issue deleting from database');
    }
    else {
      res.redirect('/');
    }
  });
});

// Verify login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})
);

module.exports = router;
