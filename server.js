"use strict";

// Setup/Start server and initialise socket.io
var express = require('express'),
	app     = express(),
	port    = process.env.PORT || 5000,
	server  = app.listen(port),
	io      = require('socket.io').listen(server);

// Require Twit libary
var Twit = require('twit');

// Initialise a new Twit instance
var T = new Twit(
{
    consumer_key:         'jNPS3iRWmCaK9Ds2UFBjDqCZk',
    consumer_secret:      '9Mwj3VzPS9cjH0HzK83vPHTfnoLqPDW14XyhHFhYFXDDEjGfYl',
    access_token:         '581168903-0toGoNmEvbtYpNHs3nq7DgJTN7l2sYZbT8Aaggkq',
    access_token_secret:  'IJSzAVfZMGiHl83Ih55FkZNSWs8UMrGib4i90m64dzU8U'
});

// Setup public directory
app.use(express.static(__dirname + '/public'));

//Setup socket.io functions passing through the socket.io & twit instances 
require('./app/socket.js')(io, T);

// Setup default routes
app.use('/', require('./app/routes/default'));

console.log('App listening on port ' + port);