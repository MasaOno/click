var express = require('express');
var router = express.Router();
var maxmind = require('maxmind');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		return next();
  }
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	router.get('/chat', isAuthenticated, function(req, res) {
		res.render('chat');
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
<<<<<<< HEAD
    var ipaddress = req.ip;
    var location = maxmind.getLocation(ipaddress);
		res.render('register', {message: req.flash('message'), ip: ipaddress});
=======
		var ipaddress = req.ip;
		res.render('register',{message: req.flash('message'), ip:ipaddress});
>>>>>>> aa4e29f7cbc09094cca79a0a41e4d77a571a2640
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
    console.log('sndfwnfi: ' + req.user.username);
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
};





