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
	res.redirect('/login');
};

module.exports = function(passport){

	router.get('/', function(req,res) {
		res.render('home');
	})
	/* GET login page. */
	router.get('/login', function(req, res) {
	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	router.get('/chat', isAuthenticated, function(req, res) {
		res.render('chat');
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/info',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){

		var ipaddress = req.ip;
		res.render('register',{message: req.flash('message'), ip:ipaddress});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/info',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/info', isAuthenticated, function(req, res){
		res.render('info', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
};





